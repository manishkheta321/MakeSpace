const converter = {};
//converting time to minutes
converter.convertTimeToMinutes = (time) => {
  let timeArray = time.split(":");
  let hours = parseInt(timeArray[0]);
  let minutes = parseInt(timeArray[1]);
  return hours * 60 + minutes;
};
module.exports = converter;
