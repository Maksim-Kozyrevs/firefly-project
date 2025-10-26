import { WebSocketServer } from "ws";



export function initWS(httpServer) {

  try {
   const serverWS = new WebSocketServer({ server: httpServer });

    serverWS.on("connection", (ws) => {
      console.log("Client connected.");
      
      ws.on("message", (data) => {
        console.log(data.toString());
      });

      ws.on("close", () => {
        console.log("Client disconnected.");
      });
    });
  } catch (error) {
    console.log("Error when WS is initializationing.\n\r", error);
  }

}