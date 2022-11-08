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
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return `${day}/${date.getMonth() + 1}/${date.getFullYear()} às
    ${date.getHours()}:${minutes}`;
}

export function getTotalTimeObject(arrayOfCalls) {
  const totalTime = arrayOfCalls.reduce((object, call) => {
    let personsTotalTime = {};
    if (call.tramites) {
      const { tramites } = call;
      for (const tramite in tramites) {
        const { finished, start, inCharge } = tramites[tramite];

        const personInCharge = inCharge
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        if (finished) {
          const timeConsumed = finished - start;

          if (!personsTotalTime[personInCharge]) {
            personsTotalTime[personInCharge] = 0;
          }
          personsTotalTime[personInCharge] += timeConsumed;
        }
      }
    }
    for (const prop in personsTotalTime) {
      if (!object[prop]) {
        object[prop] = 0;
      }
      object[prop] += personsTotalTime[prop];
    }
    return object;
  }, {});
  return totalTime;
}
