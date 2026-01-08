import { randomUUID } from "crypto";
import { WebSocketServer } from "ws";
import appError from '@project/errors';



class WebSocketsManager {

  #devicesMap;

  constructor() {
    this.#devicesMap = new Map();
  };

  async addDevice(deviceId, deviceWS) {
    
    if (this.#devicesMap.has(deviceId)) {
      const oldWS = this.#devicesMap.get(deviceId);
      
      oldWS.removeAllListeners("close");
      oldWS.terminate();
    };

    deviceWS.deviceId = deviceId;
    deviceWS.isAlive = true;
    deviceWS.pendingMap = new Map();

    deviceWS.on("message", (data) => {

      this.#handleMessage(deviceWS, data);

    });

    deviceWS.on("close", () => {
      
      this.#devicesMap.delete(deviceId);
      console.log(`Disconnected device, deviceId: ${deviceId}, timestamp: ${new Date()}`);

    });

    this.#devicesMap.set(deviceId, deviceWS);
    console.log(`New WebSocket connection, device_id: ${deviceId}, timestamp: ${new Date()}`);

  };

  sendData(deviceId, data) {

    if (!deviceId) {
      throw new appError("empty_device_id", 400);
    }
    
    const deviceWS = this.#devicesMap.get(deviceId);

    if (!deviceWS) {
      throw new appError("device_is_disabled", 499);
    }

    const requestUUID = randomUUID();

    return new Promise((resolve, reject) => {
      const pendingTimeout = setTimeout(() => {
        deviceWS.pendingMap.delete(requestUUID);
        reject(new appError("expired_timeout", 408));
      }, 5000);

      deviceWS.pendingMap.set(requestUUID, {
        reject,
        resolve,
        pendingTimeout
      });
      deviceWS.send(JSON.stringify({
        requestUUID: requestUUID,
        data: data
      }));
    });

  };

  #handleMessage(deviceWS, origData) {

    try {
      const data = JSON.parse(origData);
      
      if (data.requestUUID) {
        
        const response = deviceWS.pendingMap.get(data.requestUUID);

        if (!response) {
          throw new appError("request_not_found", 404);
        }

        clearTimeout(response.pendingTimeout);
        deviceWS.pendingMap.delete(data.requestUUID);

        if (data.status) {
          response.resolve ({
            status: true,
            data: data.data
          });
        } else {
          response.reject({
            status: false,
            data: data.data
          });
        }
      } else {
        console.log("Device's message:", data, "timestamp:", new Date());
      }
    } catch (error) {
      return {
        status: false,
        code: error.statusCode || 500,
        data: error.message || "error_when_get_device_message",
        error: error,
      }
    }

  };
  
};

export const WSManager = new WebSocketsManager();



export const initWS = (httpServer) => {

  try {
    const serverWS = new WebSocketServer({ noServer: true });

    serverWS.on("connection", (deviceWS, request, url) => {
      const deviceId = url.searchParams.get("device_id");

      WSManager.addDevice(deviceId, deviceWS);
    });

    httpServer.on("upgrade", (request, socket, head) => {
      const reqUrl = new URL(request.url, `http://${request.headers.host}`);

      if (reqUrl.pathname === "/ws/devices") {
        serverWS.handleUpgrade(request, socket, head, (ws) => {
          serverWS.emit("connection", ws, request, reqUrl);
        });
      } else {
        socket.destroy();
      }
    });
  } catch (error) {
    console.error("Error when initialization WebSockets.\n\r", error);
  }

}