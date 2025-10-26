import { WebSocketServer } from "ws";



export function initWS(httpServer, chipsWSMap) {

  try {
   const serverWS = new WebSocketServer({ noServer: true });

    serverWS.on("connection", (ws, request, url) => {
      const chipID = url.searchParams.get("chipid");

      if (!chipID) {
        ws.close(4001, "Not isset chipdID.");
        return;
      }

      chipsWSMap.set(chipID, ws)
      
      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("close", () => {
        chipsWSMap.delete(chipID);
        console.log("Client disconnected.");
      });
    });

    httpServer.on("upgrade", (request, socket, head) => {
      const reqUrl = new URL(request.url, `http://${request.headers.host}`);

      if (reqUrl.pathname === "/ws/chips") {
        serverWS.handleUpgrade(request, socket, head, (ws) => {
          serverWS.emit("connection", ws, request, reqUrl);
        });
      } else {
        socket.destroy();
      }
    });
  } catch (error) {
    console.log("Error when WS is initializationing.\n\r", error);
  }

}