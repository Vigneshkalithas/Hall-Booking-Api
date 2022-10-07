import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

// Creating a Room

app.get("/rooms", (req, res) => {
  res.send(rooms);
});

app.post("/rooms", (req, res) => {
  const { name, noOfSeats, amenities, priceForAnHour } = req.body;
  let roomExists = false;
  //   Checking if the room already exists
  rooms.forEach((room) => {
    if (room.name === name) roomExists = true;
  });
  if (!roomExists) {
    const newRoom = {
      id: rooms.length + 1,
      name,
      noOfSeats,
      amenities,
      priceForAnHour,
      timeSlots: {
        slot1: { time: "7.00 a.m - 9.00 a.m" },
        slot2: { time: "9.00 a.m - 11.00 a.m" },
        slot3: { time: "11.00 a.m - 1.00 p.m" },
        slot4: { time: "2.00 p.m - 4.00 p.m" },
        slot5: { time: "4.00 p.m - 6.00 p.m" },
      },
      bookings: {},
    };
    rooms.push(newRoom);
    res.send("New room added");
  } else res.status(400).send("A room with this name already exists...");
});

// Booking a room

app.post("/bookings", (req, res) => {
  const { roomID, customerName, date, timeSlot } = req.body;
  let selectedRoom = rooms[roomID - 1];
  let roomName = selectedRoom.name;
  // Checking if the room exists or not
  if (roomName === "")
    res
      .status(400)
      .send(
        "No room exists with the provided room ID. Please enter the correct room ID."
      );
  else {
    if (selectedRoom.bookings[date]) {
      // Checking if the timeslot exists or not
      if (selectedRoom.bookings[date][timeSlot]) {
        res
          .status(400)
          .send(
            "The selected timeslot is not available for the selected date. Please choose another date or another Timeslot"
          );
      } else {
        selectedRoom.bookings[date][timeSlot] = {
          customerName,
          time: selectedRoom.timeSlots.timeSlot,
          bookedStatus: "Booked",
        };
        if (customers[customerName]) {
          customers[customerName].push({
            roomName,
            date,
            timeSlot: selectedRoom.timeSlots[timeSlot].time,
            status: "Booked",
          });
        } else {
          customers[customerName] = [
            {
              roomName,
              date,
              timeSlot: selectedRoom.timeSlots[timeSlot].time,
              status: "Booked",
            },
          ];
        }
        res.send("Room Booked successfully");
      }
    } else {
      selectedRoom.bookings[date] = {
        [timeSlot]: { customerName, bookedStatus: "Booked" },
      };

      if (customers[customerName]) {
        customers[customerName].push({
          roomName,
          date,
          timeSlot: selectedRoom.timeSlots[timeSlot].time,
          status: "Booked",
        });
      } else {
        customers[customerName] = [
          {
            roomName,
            date,
            timeSlot: selectedRoom.timeSlots[timeSlot].time,
            status: "Booked",
          },
        ];
      }
      res.send("Room Booked successfully");
    }
  }
});

//Listing all the customers

app.get("/customers", (req, res) => {
  res.send(customers);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
