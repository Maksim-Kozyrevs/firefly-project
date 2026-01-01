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
    grant_type: "refresh_token",
    refresh_token: "a091baf6-ae20-4a0a-8856-e01a72f93408"
};

postData(apiUrl, userData)
  .then(data => console.log('Ответ от API:', data));