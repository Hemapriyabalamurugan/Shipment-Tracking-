import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
import SockJS from "sockjs-client/dist/sockjs";

let stompClient = null;

export function connectNotificationSocket(userId, onMessage) {
  if (!userId) return;

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8083/ws-notifications"),

    reconnectDelay: 5000,

    onConnect: () => {
      // console.log("✅ WebSocket Connected");

      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        const notification = JSON.parse(message.body);
        onMessage(notification);
      });
    },

    onDisconnect: () => {
      // console.log("❌ WebSocket Disconnected");
    },

    onStompError: (frame) => {
      console.error(frame);
    },
  });

  stompClient.activate();
}

export function disconnectNotificationSocket() {
  if (stompClient) {
    stompClient.deactivate();
  }
}
