#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoWebSockets.h>


using namespace websockets;
WebsocketsClient client;

const char* ethSsid = "TP-Link_F9BC_EXT";
const char* ethPassword = "54641259";

const int ledPin = 2;

bool isConnectWiFi = false;



void connetctToWiFi() { //Подключение к Wi-Fi

  pinMode(ledPin, OUTPUT);
  WiFi.begin(ethSsid, ethPassword);

  bool isWiFiConnect = false;

  Serial.print("Connecting to WiFi");
  for (int i = 0; i < 10; i++) {
    if (WiFi.status() == WL_CONNECTED) {
      digitalWrite(ledPin, HIGH);
      isWiFiConnect = true;
      break;
    } else {
      Serial.print(".");
      digitalWrite(ledPin, HIGH);
      delay(500);
      digitalWrite(ledPin, LOW);
      delay(500);
    }
  }

  if (isWiFiConnect) {
    isConnectWiFi = true;
  } else {
    esp_deep_sleep_start();
  }

  Serial.println(" - ESP32 connected to Wi-Fi.");

}

void initWS() {

  if (!isConnectWiFi || WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi isn't active.");
    return;
  }

  const char* wsUrl = "ws://81.200.146.157:8000/ws/chips";

  client.onMessage([](WebsocketsMessage message) {
    Serial.println(message.data());
  });

  client.onEvent([](WebsocketsEvent event, String data) {
    if (event == WebsocketsEvent::ConnectionOpened) {
      Serial.println("WS connection opened.");
    } else if (event == WebsocketsEvent::ConnectionClosed) {
      Serial.println("WS connection closed.");
    }
  });

  if (client.connect(wsUrl)) {
    Serial.println("WS is succesfylly conected.");
  } else {
    Serial.println("WS is failed connected.");
  }

}



void setup() {
  
  //Инициализация порта
  Serial.begin(115200);
  Serial.println("ESP32 is ready.");

  connetctToWiFi();

  if (isConnectWiFi) {
    initWS();
  }

}

void loop() {

  if (!client.available()) {
    Serial.println("WS is closed.");
    client.connect("ws://81.200.146.157:8000/ws/chips");
  }

  client.poll();

}
