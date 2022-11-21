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
  // if (timeInSecs < 86400) {  === COMENTING TO RENDER HOURS NOT DAYS hr ${minPassHour.toFixed(0)} min)
  return `${timeInHours.toFixed(0)}`;
  // }
  const days = timeInHours / 24;
  const text = days.toFixed(0) > 1 ? ' dias' : ' dia';
  return days.toFixed(0) + text;
}

export function getBeatyDate(dateInMs) {
  const date = new Date(dateInMs);

  if (!date.getDate()) {
    return '';
  }

  const monthPlus1 = date.getMonth() + 1;
  const day = `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`;
  const month = `${monthPlus1 > 9 ? monthPlus1 : '0' + monthPlus1}`;
  const minute = `${
    date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  }`;
  const hour = `${
    date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  }`;

  return `${day}/${month}/${date.getFullYear()} às
    ${hour}:${minute}`;
}

export function getStringDateToTimeInput(dateString) {
  const newDateObject = new Date(dateString);

  const minutes =
    newDateObject.getMinutes() < 10
      ? '0' + newDateObject.getMinutes()
      : newDateObject.getMinutes();

  const hours =
    newDateObject.getHours() < 10
      ? '0' + newDateObject.getHours()
      : newDateObject.getHours();
  const day =
    newDateObject.getDate() < 10
      ? '0' + newDateObject.getDate()
      : newDateObject.getDate();

  const month = newDateObject.getMonth() + 1;
  const inputMonth = month > 9 ? month : '0' + month;
  const date = newDateObject.getFullYear() + '-' + inputMonth + '-' + day;

  const hour = hours + ':' + minutes;
  return { hour, date };
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
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

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
