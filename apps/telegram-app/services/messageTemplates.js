import path from "path";
import { fileURLToPath } from "url";
import { getTimesheet } from "./timesheetServices.js";
import sortTimesheetBtn from "./sortTimesheetBtn.js";



const dirname = path.dirname(fileURLToPath(import.meta.url));



export async function sendMenuTemplate(tgBot, chatId) { //Вывод меню

  const menuObj = {
    reply_markup: {
      inline_keyboard: [
        [{text: "Включить Smart Dish", callback_data: JSON.stringify({
          type: "command",
          command: "chip-light-on"
        })}],
        [{text: "Выключить Smart Dish", callback_data: JSON.stringify({
          type: "command",
          command: "chip-light-off"
        })}],
        [{text: "Выдача питания - 20 гр", callback_data: JSON.stringify({
          type: "command",
          command: "give-feed"
        })}],
        [{text: "Расписание", callback_data: JSON.stringify({
          type: "timesheet",
          step: "timesheet"
        })}]
      ],
  }};

  await tgBot.sendPhoto(chatId, path.join(dirname, "../assets/images/menu-banner.webp"), menuObj);
};



export async function sendTimesheetTemplate(tgBot, chatId, userName, typeImg) { //Вывод расписания

  const response = await getTimesheet(`@${userName}`);
  
  if (!response.status) {
    if (response.httpCode === 404) {
      await tgBot.sendMessage(chatId, "У вас еще нет привязанной Smart Dish.");
      return;
    } else {
      await tgBot.sendMessage(chatId, "При обработке запроса возникла ошибка, попробуйте позже.");
      return;
    }
  }

  let timesheetMenu = {
    reply_markup: {
      inline_keyboard: sortTimesheetBtn(response.data)
    }
  };
  
  let imagePath;

  switch (typeImg) {
    case ("success"):
      imagePath = path.join(dirname, "../assets/images/success-banner.webp");
      break;
    default:
      imagePath = path.join(dirname, "../assets/images/timesheet-banner.webp");
  };

  tgBot.sendPhoto(chatId, imagePath, timesheetMenu);

}