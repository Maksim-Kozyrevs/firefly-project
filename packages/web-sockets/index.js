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

      console.log(`Disconnected device, deviceId: ${deviceId}, timestamp: ${new Date()}`);
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
      return {
        status: false,
        code: 400,
        data: "empty_device_id"
      };
    }
    
    const deviceWS = this.#devicesMap.get(deviceId);

    if (!deviceWS) {
      return {
        status: false,
        code: 499,
        data: "Устройство не подключено.",
        yandex_error_code: "DEVICE_OFF",
        deviceId: deviceId
      };
    }

    const requestUUID = randomUUID();

    return new Promise((resolve, reject) => {
      const pendingTimeout = setTimeout(() => {
        deviceWS.pendingMap.delete(requestUUID);
        resolve({
          status: false,
          code: 499,
          data: "Устройство не подключенно.",
          yandex_error_code: "DEVICE_OFF",
          deviceId: deviceId
        });
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
          return {
            status: false,
            code: 408,
            data: "Истекло время ожидания, попробуйте снова.",
            deviceId: deviceWS.deviceId
          };
        }

        clearTimeout(response.pendingTimeout);
        deviceWS.pendingMap.delete(data.requestUUID);

        if (data.status) {
          response.resolve ({
            status: true,
            code: 200,
            data: data.data,
            deviceId: deviceWS.deviceId
          });
        } else {
          response.relove({
            status: false,
            code: 409,
            data: "Ошибка устройства, попробуйте снова.",
            yandex_error_code: "INTERNAL_ERROR",
            deviceId: deviceWS.deviceId
          });
        }
      } else {
        console.log("Device's message:", data, "timestamp:", new Date());
      }
    } catch (error) {
      return {
        status: false,
        code: 500,
        data: "Ошибка на сервере, попробуйте снова. ",
        error: error,
        yandex_error_code: "INTERNAL_ERROR",
        deviceId: deviceWS.deviceId
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