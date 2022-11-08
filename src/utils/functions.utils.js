export function getTimeStringFromMs(timeInMs) {
  const timeInSecs = timeInMs / 1000;
  if (timeInSecs < 60) {
    return `${timeInSecs.toFixed(0)} seg`;
  }
  const timeInMin = timeInSecs / 60;
  if (timeInSecs < 3600) {
    return `${timeInMin.toFixed(0)} min`;
  }
  const timeInHours = timeInMin / 60;
  const minPassHour = timeInMin % 60;
  if (timeInSecs < 86400) {
    return `${timeInHours.toFixed(0)} hr ${minPassHour.toFixed(0)} min`;
  }
  const days = timeInHours / 24;
  const text = days.toFixed(0) > 1 ? " dias" : " dia";
  return days.toFixed(0) + text;
}

export function getBeatyDate(dateInMs) {
  const date = new Date(dateInMs);

  if (!date.getDate()) {
    return "";
  }


  const monthPlus1 = date.getMonth() + 1 

  const day = `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
  const month = `${monthPlus1 > 9 ? monthPlus1 : '0' + monthPlus1}`
  const minute = `${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}`
  const hour = `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}`
  
  return `${day}/${month}/${date.getFullYear()} às
    ${hour}:${minute}`;
}
