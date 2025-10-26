import { WebSocketServer } from "ws";



export function initWS(httpServer) {

  try {
   const serverWS = new WebSocketServer({ noServer: true });

    serverWS.on("connection", (ws) => {
      console.log("Client connected.");

      ws.send(JSON.stringify({
        command: "Test",
        data: "Succesfully response from server!"
      }))
      
      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("close", () => {
        console.log("Client disconnected.");
      });
    });

    httpServer.on("upgrade", (request, socket, head) => {
      if (request.url == "/ws/chips") {
        serverWS.handleUpgrade(request, socket, head, (ws) => {
          serverWS.emit("connection", ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  } catch (error) {
    console.log("Error when WS is initializationing.\n\r", error);
  }

}