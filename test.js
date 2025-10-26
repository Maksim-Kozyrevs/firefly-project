const url = "http://81.200.146.157:8000/api/command";
const data = {
  chipID: "ESP32-LGD67cdvznCawTzbdsxF",
  command: "chip-light-off"
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  console.log(response);
})
.catch(error => {
  console.error("Ошибка запроса:", error);
});