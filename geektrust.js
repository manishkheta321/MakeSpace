const fs = require("fs");
const timeConverter = require("./convertTime");
const MeetingRoom = require("./meetingRoom");
const meetingRoomsName = ["C-Cave", "D-Tower", "G-Mansion"];
const maxPersonsAllowed = [3, 7, 20];
const interval = 15;

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

const meetingRooms = [];
for (let rooms in meetingRoomsName) {
  let room = new MeetingRoom.GetMeetingRoom(
    meetingRoomsName[rooms],
    maxPersonsAllowed[rooms]
  );
  meetingRooms.push(room);
}

vacantRooms = (startTime, endTime) => {
  let vacantRooms = [];

  meetingRooms.forEach((room) => {
    if (room.isRoomAvailable(startTime, endTime)) {
      vacantRooms.push(room.getName());
    }
  });
  return vacantRooms.length > 0 ? vacantRooms.join(" ") : "NO_VACANT_ROOM";
};

bookVacantRoom = (startTime, endTime, persons) => {
  for (var i = 0; i < meetingRooms.length; i++) {
    var result = meetingRooms[i].bookRoom(startTime, endTime, persons);
    if (result) {
      return meetingRooms[i].getName();
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
