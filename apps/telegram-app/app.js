import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

import { editTimesheet } from "./services/timesheetServices.js";
import cleanUserStatus from "./services/cleanUserStatus.js";
import { sendMenuTemplate, sendTimesheetTemplate } from "./services/messageTemplates.js";



const tgBotToken = "8248086356:AAFxuPlB-z4SLiYwb22y_KIb6y8fXwlRjf8";
const commandApi = "https://api.ai-firefly.ru/v1/command";



function startTgBot() {

  try {
    const usersSteps = new Map();

    const tgBot = new TelegramBot(tgBotToken, { polling: true });

    const startMenu = {
      reply_markup: {
        keyboard: [
          ["Меню"],
          ["Расписание"]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    };

    tgBot.onText(/\/start/, async (message) => { //Стартовое сообщение
      tgBot.sendMessage(message.chat.id, "Вы в боте управления вашей Smart Dish!", startMenu);
      await sendMenuTemplate(tgBot, message.chat.id);
    });

    tgBot.onText(/Меню/, async (message) => { //Вывод меню
      await sendMenuTemplate(tgBot, message.chat.id);
    });

    tgBot.onText(/Расписание/, async (message) => { //Вывод расписания
      await sendTimesheetTemplate(tgBot, message.chat.id, message.from.username);
    });

    tgBot.on("callback_query", async (query) => { //Обработка кнопок

      const queryId = query.id;
      const chatId = query.message.chat.id;
      const userName = query.from.username;
      const userId = query.from.id;

      cleanUserStatus(userName, usersSteps);

      try {
        const data = JSON.parse(query.data);

        if (data.type == "command") { //Обработка команд
          const response = await axios.post(commandApi, {
            command: data.command,
            userName: `@${userName}`
          });

          if (response.data.status === true) {
            await tgBot.answerCallbackQuery({
              callback_query_id: queryId,
              text: "Команда успешно отправлена на вашу Smart Dish!",
              show_alert: false
            });
          }
        } else if (data.type == "menu") { //Вывод меню
          await sendMenuTemplate(tgBot, chatId);
          await tgBot.answerCallbackQuery({callback_query_id: queryId});
        } else if (data.type == "e-t") { //Вывод меню редактирования еденицы описания
          const editTimeEventMenu = {
            reply_markup: {
              inline_keyboard: [
                [{text: "Изменить", callback_data: JSON.stringify({
                  type: "update-timesheet",
                  timeEventIndex: data.TEI
                })}],
                [{text: "Удалить", callback_data: JSON.stringify({
                  type: "delete-timesheet",
                  timeEventIndex: data.TEI
                })}]
              ]
            }
          };

          await tgBot.sendMessage(chatId, `Измениние — ${data.T}, ${data.WF} гр.`, editTimeEventMenu);
          await tgBot.answerCallbackQuery({callback_query_id: queryId});
        } else if (data.type == "update-timesheet" || data.type == "add-timesheet") { //Обновление и добавление еденицы расписания
          if (data.type == "update-timesheet") {
            usersSteps.set(userName, {"type": "update-timesheet", "timeEventIndex": data.timeEventIndex});
          } else {
            usersSteps.set(userName, {"type": "add-timesheet", "timeEventIndex": data.timeEventIndex});
          }
          

          await tgBot.sendMessage(chatId, "Введите новые данные для расписани в формате: 00:00, вес");
          await tgBot.answerCallbackQuery({callback_query_id: queryId});
        } else if (data.type == "delete-timesheet") { //Удаление еденицы расписания
          const response = await editTimesheet("delete-timesheet", `@${userName}`, {index: data.timeEventIndex});

          if (!response.status) {
            if (response.httpCode === 404) {
              await tgBot.sendMessage(chatId, "У вас еще нет привязанной Smart Dish.");
              return;
            } else {
              await tgBot.sendMessage(chatId, "При обработке запроса возникла ошибка, попробуйте позже.");
              return;
            }
          }

          await sendTimesheetTemplate(tgBot, chatId, userName, "success");
          await tgBot.answerCallbackQuery({callback_query_id: queryId});
        } else if (data.type == "timesheet") { // Вывод меню расписания
          await sendTimesheetTemplate(tgBot, chatId, userName);
          await tgBot.answerCallbackQuery({callback_query_id: queryId});
        } else { //Обработка неизвстных команд
          tgBot.answerCallbackQuery({
            callback_query_id: queryId,
            text: "Неизвестная команда.",
            show_alert: false
          });
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status;

          if (status === 404) {
            await tgBot.sendMessage(chatId, "У вас еще нет привязанной Smart Dish.");
            
            await tgBot.answerCallbackQuery({
              callback_query_id: queryId,
              text: "У вас еще нет привязанной Smart Dish.",
              show_alert: false
            });
          } else if (status === 499) {
            await tgBot.answerCallbackQuery({
              callback_query_id: queryId,
              text: "Ваша Smart Dish не подключена.",
              show_alert: false
            });
          } else {
            await tgBot.answerCallbackQuery({
              callback_query_id: queryId,
              text: "Команда не была принята вашей Smart Dish, ошибка.",
              show_alert: false
            });
          }
        } else {
          await tgBot.answerCallbackQuery({
            callback_query_id: queryId,
            text: `При обработке запроса возникла ошибка:\n\r${error}`,
            show_alert: false
          });
        }
      }

    });

    tgBot.on("message", async (message) => { //Обработка сообщений

      const userId = message.from.id;
      const userMessage = message.text;
      const userName = message.from.username;

      try {
        if (usersSteps.has(userName)) {
          const userStep = usersSteps.get(userName);

          if (userStep.type === "update-timesheet" || userStep.type === "add-timesheet") {
            const newData = userMessage.replace(/\s/g, "").split(",");
            
            if (newData.length != 2) {
              await tgBot.sendMessage(userId, "Неверный формат данных, попробуйте еще раз. Пример — 00:00, 100");
              return;
            }

            const dataObj = {
              time: newData[0],
              weightFood: Number(newData[1]),
              index: userStep.timeEventIndex ?? NaN
            };

            const response = await editTimesheet(userStep.type == "update-timesheet" ? "update-timesheet" : "add-timesheet", `@${userName}`, dataObj);

            if (!response.status) {
              tgBot.sendMessage(userId, `При обработке запроса возникла ошибка, попробуйте позже.\n\Error code: ${response.httpCode}\n\rError: ${response.data}`);
              return;
            }

            usersSteps.delete(userName);

            await sendTimesheetTemplate(tgBot, userId, userName, "success");
          }
        }
      } catch (error) {
         await tgBot.sendMessage(userId, `При обработке запроса возникла ошибка:\n\r${error}`);
         return;
      }

    });

    console.log("Telegramm bot is succesfully initializing.");
  } catch (error) {
    console.log("Error when telegram bot is initializing.\n\r", error);
  }

}



startTgBot();