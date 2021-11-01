class MeetingRoom {
  constructor(name, maxPersonsAllowed) {
    this.name = name;
    this.timeConverter = require("./convertTime");
    this.maxPersonsAllowed = maxPersonsAllowed;
    this.bookings = [];
    this.bufferTimes = [
      ["09:00", "09:15"],
      ["13:15", "13:45"],
      ["18:45", "19:00"],
    ];
  }

  CheckingIfBufferTimeOverlapsMeeting(startTime, endTime) {
    for (let index in this.bufferTimes) {
      let convertedBufferTimeStart = this.timeConverter.convertTimeToMinutes(
        this.bufferTimes[index][0]
      );
      let convertedBufferTimeEnd = this.timeConverter.convertTimeToMinutes(
        this.bufferTimes[index][1]
      );

      if (
        startTime <= convertedBufferTimeStart &&
        endTime >= convertedBufferTimeEnd
      ) {
        return true;
      }
    }
    return false;
  }
  IsRoomAvailable(startTime, endTime) {
    if (this.CheckingIfBufferTimeOverlapsMeeting(startTime, endTime))
      return false;
    let isVacant = true;
    for (let index in this.bookings) {
      let start, end;
      start = this.bookings[index].startTime;
      end = this.bookings[index].endTime;
      if (start <= startTime && end > startTime) {
        isVacant = false;
        break;
      } else if (start >= startTime && start < endTime) {
        isVacant = false;
        break;
      }
    }
    return isVacant;
  }
  BookRoom(startTime, endTime, persons) {
    if (persons > this.maxPersonsAllowed) {
      return false;
    }

    let result = this.IsRoomAvailable(startTime, endTime);
    if (result) {
      let range = { startTime, endTime };
      this.bookings.push(range);
      return true;
    }
    return false;
  }

  get GetName() {
    return this.name;
  }
}
module.exports = { MeetingRoom: MeetingRoom };
