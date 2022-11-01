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
  return `${days.toFixed(0)} dias`;
}
