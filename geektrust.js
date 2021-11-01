const fs = require("fs");
const timeConverter = require("./convertTime");

const meetingRoomsName = ["C-Cave", "D-Tower", "G-Mansion"];
const maxPersonsAllowed = [3, 7, 20];
const interval = 15;

const meetingRooms = [];
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
convertTimeToMinutes = (time) => {
  return timeConverter.convertTimeToMinutes(time);
};

//checking if the time is valid
checkValidInput = (startTime, endTime) => {
  let minutesInStartTime = startTime % 60;
  let minutesInEndTime = endTime % 60;
  if (minutesInEndTime % interval != 0 || minutesInStartTime % interval != 0) {
    return false;
  }
  if (startTime > endTime) {
    return false;
  }
  return true;
};

for (let rooms in meetingRoomsName) {
  let room = new MeetingRoom(meetingRoomsName[rooms], maxPersonsAllowed[rooms]);
  meetingRooms.push(room);
}

vacantRooms = (startTime, endTime) => {
  let vacantRooms = [];

  meetingRooms.forEach((room) => {
    if (room.IsRoomAvailable(startTime, endTime)) {
      vacantRooms.push(room.GetName);
    }
  });
  return vacantRooms.length > 0 ? vacantRooms.join(" ") : "NO_VACANT_ROOM";
};

bookVacantRoom = (startTime, endTime, persons) => {
  for (var i = 0; i < meetingRooms.length; i++) {
    var result = meetingRooms[i].BookRoom(startTime, endTime, persons);
    if (result) {
      return meetingRooms[i].GetName;
    }
  }
  return "NO_VACANT_ROOM";
};

let filename = process.argv[2];

fs.readFile(filename, (err, data) => {
  if (err) throw err;
  var lines = data.toString().split("\n");

  lines.forEach((line) => {
    let lineArray = line.split(" ");
    let firstWord = lineArray[0];
    let startTimeInMinutes = convertTimeToMinutes(lineArray[1]);
    let endTimeInMinutes = convertTimeToMinutes(lineArray[2]);
    let result = checkValidInput(startTimeInMinutes, endTimeInMinutes);
    if (!result) {
      console.log("INCORRECT_INPUT");
    } else if (firstWord == "BOOK") {
      let numberOfPerson = parseInt(lineArray[3]);
      let bookedRoom = bookVacantRoom(
        startTimeInMinutes,
        endTimeInMinutes,
        numberOfPerson
      );
      console.log(bookedRoom);
    } else {
      let vacantRoomsForMeeting = vacantRooms(
        startTimeInMinutes,
        endTimeInMinutes
      );
      console.log(vacantRoomsForMeeting);
    }
  });
});
