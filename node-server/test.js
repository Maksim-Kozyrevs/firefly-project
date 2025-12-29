async function sendData() {
  const url = "https://ai-firefly.ru/api/command";
  const data = { 
    command: "chip-light-on",
    userName: "@MaksimKozyrevs"
  };

  try {
    const response = await fetch(url, {
      method: 'POST', // Метод запроса
      headers: {
          'Content-Type': 'application/json' // Указываем, что отправляем JSON
      },
      body: JSON.stringify(data) // Превращаем объект JS в строку JSON
    });



    const result = await response.json(); // Читаем ответ от сервера
    console.log('Успех:', result);
  } catch (error) {
    console.error('Ошибка при отправке:', error);
    console.log(response.body)
  }
}

sendData();