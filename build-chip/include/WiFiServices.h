#ifndef WIFI_SERVICES_H
#define WIFI_SERVICES_H

namespace WiFiServices {
    void initWiFi(const char* ethSsid, const char* ethPassword, int chipLedPin);
    bool isConnectedWiFi();
}

#endif