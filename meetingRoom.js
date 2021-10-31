const timeConverter = require("./convertTime");
function GetMeetingRoom(name, maxPersonsAllowed) {
  let bookings = [];
  let maxPersons = maxPersonsAllowed;
  let bufferTimes = [
    ["09:00", "09:15"],
    ["13:15", "13:45"],
    ["18:45", "19:00"],
  ];
  this.name = name;

  this.checkingIfBufferTimeOverlapsMeeting = (startTime, endTime) => {
    for (let i = 0; i < bufferTimes.length; i++) {
      let convertedBufferTimeStart = timeConverter.convertTimeToMinutes(
        bufferTimes[i][0]
      );
      let convertedBufferTimeEnd = timeConverter.convertTimeToMinutes(
        bufferTimes[i][1]
      );

      if (
        startTime <= convertedBufferTimeStart &&
        endTime >= convertedBufferTimeEnd
      ) {
        return true;
      }
    }
    return false;
  };

  this.isRoomAvailable = function (startTime, endTime) {
    if (this.checkingIfBufferTimeOverlapsMeeting(startTime, endTime))
      return false;
    let ans = [];
    let isVacant = true;
    for (let index in bookings) {
      let start, end;
      start = bookings[index].startTime;
      end = bookings[index].endTime;
      if (start <= startTime && end > startTime) {
        isVacant = false;
        break;
      } else if (start >= startTime && start < endTime) {
        isVacant = false;
        break;
      }
    }
    return isVacant;
  };
  this.bookRoom = (startTime, endTime, persons) => {
    if (persons > maxPersons) {
      return false;
    }

    let result = this.isRoomAvailable(startTime, endTime);
    if (result) {
      let range = { startTime: startTime, endTime: endTime };

      bookings.push(range);
      return true;
    }
    return false;
  };

  this.getName = function () {
    return this.name;
  };
}

module.exports = { GetMeetingRoom };
