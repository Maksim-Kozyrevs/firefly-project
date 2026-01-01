async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // Указываем метод
      headers: {
        'Content-Type': 'application/json' // Обязательно для JSON
      },
      body: JSON.stringify(data) // Превращаем объект в строку JSON
    });

    if (!response.ok) {
      // Если статус не 200-299, выбрасываем ошибку
      console.error(`Ошибка сервера: ${response.status}`);
    }

    const result = await response.json(); // Парсим ответ
    return result;
}

// Пример использования:
const apiUrl = "https://api.ai-firefly.ru/yandex/v1.0/token";
const userData = {
    grant_type: "authorization_code",
    code: "5ea193ac-9e3e-4d55-85df-d57e4a694e35"
};

postData(apiUrl, userData)
  .then(data => console.log('Ответ от API:', data));