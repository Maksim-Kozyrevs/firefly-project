function sortTimesheetBtn(data) {

  const responseArray = [];

  data.forEach((timeEvent, index) => {
    responseArray.push(
      [{text: `${timeEvent.time}, ${timeEvent.weightFood} гр.`, callback_data: JSON.stringify({
        type: "e-t",
        TEI: index,
        T: timeEvent.time,
        WF: timeEvent.weightFood
      })}]
    );
  });

  responseArray.sort((a, b) => {
    const timeA = JSON.parse(a[0].callback_data).T;
    const timeB = JSON.parse(b[0].callback_data).T;

    const [h1, m1] = timeA.split(":").map(Number);
    const [h2, m2] = timeB.split(":").map(Number);

    return (h1 * 60 + m1) - (h2 * 60 + m2);
  });

  responseArray.push(
    [{text: "Добавить", callback_data: JSON.stringify({
      type: "add-timesheet",
    })}],
    [{text: "Меню", callback_data: JSON.stringify({
      type: "menu"
    })}]
  );

  return responseArray;

}



export default sortTimesheetBtn;