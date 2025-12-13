#include <Arduino.h>
#include <WiFi.h>
#include "WiFiServices.h"



namespace WiFiServices {

  void initWiFi(const char* ethSsid, const char* ethPassword, int chipLedPin) { //Инициализация WiFi

    WiFi.begin(ethSsid, ethPassword);
    WiFi.setAutoReconnect(true);
    WiFi.persistent(true);

    Serial.print("Connecting to WiFi");
    for (int i = 0; i < 10; i++) {
      if (WiFi.status() == WL_CONNECTED) {
        digitalWrite(chipLedPin, HIGH);
        break;
      } else {
        Serial.print(".");
        digitalWrite(chipLedPin, HIGH);
        delay(500);
        digitalWrite(chipLedPin, LOW);
        delay(500);
      }
    }

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println(" - ESP32 not connected to Wi-Fi.");
    } else {
      Serial.println(" - ESP32 connected to Wi-Fi.");
    }

  }

  bool isConnectedWiFi () {
    return WiFi.status() == WL_CONNECTED;
  }
    
};