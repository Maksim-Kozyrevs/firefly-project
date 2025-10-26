#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


const char* ethSsid = "TP-Link_F9BC_EXT";
const char* ethPassword = "54641259";

const int ledPin = 2;

bool isConnectWiFi = false;



struct apiResponse {
  bool status;
  int httpCode;
  String responseJSON;
};



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

  Serial.println();
  Serial.println(" - ESP32 connected to Wi-Fi.");
  Serial.println(WiFi.localIP());
}

apiResponse getRequest(char* api) {
  apiResponse result = {false, 0, ""};

  HTTPClient http;

  http.begin(api);
  int httpCode = http.GET();

  if (httpCode != 0) {
    if (httpCode == HTTP_CODE_OK) {
      String responseJSON = http.getString();
      result.status = true;
      result.httpCode = httpCode;
      result.responseJSON = responseJSON;
    } else {
      result.status = false;
      result.httpCode = httpCode;
    }
  } else {
      result.status = false;
      result.httpCode = httpCode;
  }

  http.end();

  return result;
}



void setup() {
  //Инициализация порта
  Serial.begin(115200);
  Serial.println("ESP32 is ready.");

  connetctToWiFi();

  if (isConnectWiFi) {
    apiResponse response = getRequest("http://81.200.146.157:8000/test");

    if (response.status) {
      Serial.println(response.responseJSON);
    } else {
      Serial.print("Ошибка при отправке запроса, код ответа: ");
      Serial.print(response.httpCode);
    }
  }
}

void loop() {
}
