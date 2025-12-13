import pool from "../modules/connectDB.js";
import axios from "axios";



//Получение расписания
export async function getTimesheet(tgUserName) {

  try{
    const timesheet = await pool.query("SELECT timesheet FROM esp32_chips WHERE tg_user_names @> $1", [JSON.stringify([tgUserName])]);

    if (timesheet.rows.length === 0) {
      return {
        status: false,
        httpCode: 404
      };
    }

    return {
      status: true,
      data: timesheet.rows[0].timesheet
    };
  } catch (error) {
    return {
      status: false,
      httpCode: 500,
      data: error
    };
  }

}



export async function editTimesheet(event, tgUserName, dataObj) { //Редактирование расписания

  try {
    const timesheetData = await getTimesheet(tgUserName);

    if (!timesheetData.status) {
      return timesheetData;
    }
    const timesheet = timesheetData.data;

    switch (event) {
      case "update-timesheet":
        timesheet[dataObj.index] = {
          time: dataObj.time,
          weightFood: dataObj.weightFood
        };
        break;

      case "delete-timesheet":
        timesheet.splice(dataObj.index, 1);
        break;

      case "add-timesheet":
        timesheet.push({
          time: dataObj.time,
          weightFood: dataObj.weightFood
        });
        break;
      
      default:
        return {
          status: false,
          httpCode: 400
        };
    }

    const response = await pool.query("UPDATE esp32_chips SET timesheet=$1 WHERE tg_user_names @> $2", [JSON.stringify(timesheet), JSON.stringify([tgUserName])]);

    if (response.rowCount === 0) {
      return {
        status: false,
        httpCode: 404
      };
    }

    if (event === "update-timesheet") {
      axios.post("http://81.200.146.157:8000/api/update-timesheet", {
        userName: tgUserName
      });
    }

    return {
      status: true,
      data: timesheet
    };
  } catch (error) {
    return {
      status: false,
      httpCode: 500,
      data: error
    };
  }

}