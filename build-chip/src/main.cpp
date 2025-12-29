#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoWebSockets.h>
#include <ESP32Servo.h>
#include <string>
#include <vector>
#include <SPIFFS.h>
#include <sntp.h>
#include <HX711.h>

#include "WiFiServices.h"



//Данные платы
String CHIP_ID = "3547f5dc-bc55-497e-834b-88dab0b2cd09";

//Данные WiFi
const char* ETH_SSID = "TP-Link_F9BC_EXT";
const char* ETH_PASSWORD = "54641259";

//Компоненты WebSockets
using namespace websockets;
WebsocketsClient client;
String urlWS = "ws://109.68.214.90:8000/ws/chips?chipid=" + CHIP_ID;

//Внешние компоненты
const int pinPowerLed = 13;
const int pinWiFiLed = 12;
const int chipLedPin = 2;
const int testPin = 16;
const int testPin2 = 17;
const int testPin3 = 5;

HX711 loadCell;
#define LOADCELL_DOUT_PIN 26
#define LOADCELL_SCK_PIN 27

//Стуктуры для расписания
int timesheetCount = 0;
struct timesheetStructure {
  int hours;
  int minutes;
  int weightFood;
};
std::vector<timesheetStructure> timesheet;

struct tm timeinfo;
std::vector<int> executedMinutes;

//Глобальные переменные
bool isWSConnected = false;



void giveFeed(int weightFood) { //Выдача питания
  
  pinMode(testPin, OUTPUT);
  pinMode(testPin2, OUTPUT);
  pinMode(testPin3, OUTPUT);
  digitalWrite(chipLedPin, HIGH);

  while (true) {
    long weight = loadCell.get_units(20);

    if (weight >= weightFood) {
      pinMode(testPin, INPUT);
      pinMode(testPin2, INPUT);
      pinMode(testPin3, INPUT);
      digitalWrite(chipLedPin, LOW);
      break;
    }
  }

}
bool executeCommand(String command) { //Выполнение команд

  if (command == "chip-light-on") {
    pinMode(testPin, OUTPUT);
    pinMode(testPin2, OUTPUT);
    pinMode(testPin3, OUTPUT);
    digitalWrite(chipLedPin, HIGH);
    return true;
  }

  if (command == "chip-light-off") {
    pinMode(testPin, INPUT);
    pinMode(testPin2, INPUT);
    pinMode(testPin3, INPUT);
    digitalWrite(chipLedPin, LOW);
    return true;
  }

  if (command == "give-feed") {
    giveFeed(20);
    return true;
  }

  return false;

}

void updateTimsheet (const String& timesheetJson) {

  timesheet.clear();

  StaticJsonDocument<2048> doc;
  DeserializationError error = deserializeJson(doc, timesheetJson);

  if (error) {
    Serial.println("Json parse error, when update timesheet:\n\r" + String(error.c_str()));
    return;
  }

  JsonArray array = doc.as<JsonArray>();
  timesheetCount = 0;

  for (JsonObject item : array) {
    const char* timeStr = item["time"];
    int weightFood = item["weightFood"];

    int hour = 0, minute = 0;
    sscanf(timeStr, "%d:%d", &hour, &minute);

    timesheetStructure ts;
    ts.hours = hour;
    ts.minutes = minute;
    ts.weightFood = weightFood;

    timesheet.push_back(ts);
    timesheetCount++;
  }

  File file = SPIFFS.open("/timesheet.json", FILE_WRITE);
  if (!file) {
      Serial.println("Failed to open file for writing.");
      return;
  }

  file.print(timesheetJson);
  file.close();

  Serial.println("Timesheet is updated.");
  
}

void getTimesheet () {

  HTTPClient http;

  http.begin("http://81.200.146.157:8000/api/get-timesheet/?chipid=" + CHIP_ID);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String response = http.getString();

    StaticJsonDocument<2048> docJson;
    DeserializationError error = deserializeJson(docJson, response);

    if (error) {
      Serial.println("Json parse error, when get timesheet:\n\r" + String(error.c_str()));
      return;
    }

    if (!docJson["status"]) {
      Serial.println("Response status is False.");
      return;
    }
    
    String timeSheetString;
    serializeJson(docJson["data"], timeSheetString);

    updateTimsheet(docJson["data"]);
  } else {
    Serial.println("Error HTTP request when get timesheet.");
  }

}

void initWS() { //Иницифлизация WebSocket

  if (!WiFiServices::isConnectedWiFi()) {
    Serial.println("WiFi isn't active.");
    return;
  }

  client.onMessage([](WebsocketsMessage message) {
    DynamicJsonDocument doc(256);
    DeserializationError error = deserializeJson(doc, message.data());

    if (error) {
      Serial.println("Json parse error:");
      return;
    }

    if (doc["type"] == "command") {
      if (!executeCommand(doc["command"])) {
        Serial.println("Command isn't found.");
      } else {
        Serial.println("Command is succesfully executed.");
      }
    } else if (doc["type"] == "update-timesheet") {
      getTimesheet();
    }
  });

  client.onEvent([](WebsocketsEvent event, String data) {
    if (event == WebsocketsEvent::ConnectionOpened) {
      isWSConnected = true;
      Serial.println("WS connection opened.");
    } else if (event == WebsocketsEvent::ConnectionClosed) {
      isWSConnected = false;
      Serial.println("WS connection closed.");
    }
  });

  if (client.connect(urlWS)) {
    Serial.println("WS is succesfylly conected.");
  } else {
    Serial.println("WS is failed connected.");
  }

}

void getLocalTimesheet () {

  if (SPIFFS.exists("/timesheet.json")) {
    File file = SPIFFS.open("/timesheet.json", FILE_READ);

    if (!file) {
      Serial.println("Failed to open timesheet.json for reading.");
      return;
    }

    String timesheetStr = file.readString();

    file.close();

    updateTimsheet(timesheetStr);
  } else {
    Serial.println("Not found file - timesheet.json.");
  }

}

void initSPIFSS() {

    if (!SPIFFS.begin(true)) {
        Serial.println("Failed to mount SPIFFS");
        return;
    }
    Serial.println("SPIFFS mounted successfully");

}

void checkTimesheet () {

  static int lastCheckedMinute = -1;

  int currentHour = timeinfo.tm_hour;
  int currentMinute = timeinfo.tm_min;
  int currentSecond = timeinfo.tm_sec;

  if (currentMinute != lastCheckedMinute) {
      executedMinutes.clear();
      lastCheckedMinute = currentMinute;
  }

  for (size_t i = 0; i < timesheet.size(); i++) {
    timesheetStructure ts = timesheet[i];

    if (ts.hours == currentHour && ts.minutes == currentMinute) {
        if (std::find(executedMinutes.begin(), executedMinutes.end(), i) == executedMinutes.end()) {
            giveFeed(ts.weightFood);
            executedMinutes.push_back(i);
        }
    }
  }

}



void setup() {
  
  //Инициализация порта
  Serial.begin(115200);
  Serial.println("ESP32 is ready.");

  //Инициализация светодиодов
  pinMode(pinPowerLed, OUTPUT);
  digitalWrite(pinPowerLed, HIGH);

  pinMode(pinWiFiLed, OUTPUT);
  pinMode(chipLedPin, OUTPUT);

  pinMode(testPin, INPUT);
  pinMode(testPin2, INPUT);
  pinMode(testPin3, INPUT);

  //Инициализация SPIFFS
  initSPIFSS();

  //Инициализация датчика веса
  loadCell.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  loadCell.set_scale(467);
  loadCell.tare(20);

  //Инициализация WiFi
  WiFiServices::initWiFi(ETH_SSID, ETH_PASSWORD, pinWiFiLed);

  //Инициализация модулей зависимых от WiFi
  if (WiFiServices::isConnectedWiFi()) {
    initWS(); //Инициализация WebSocket
    getTimesheet(); //Обновление расписания

    configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
    sntp_set_sync_interval(5 * 60 * 1000);
  } else {
    getLocalTimesheet();
  }
  
}

void loop() {

  if (!WiFiServices::isConnectedWiFi()){
    digitalWrite(pinWiFiLed, LOW);
  } else {
    digitalWrite(pinWiFiLed, HIGH);
  }

  if (!isWSConnected) {
    Serial.println("WS is closed.");
    client.connect(urlWS);
  }

  client.poll();

  if (!getLocalTime(&timeinfo)) {
    return;
  }

  checkTimesheet();

  delay(500);

}