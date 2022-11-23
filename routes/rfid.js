var mqtt = require("mqtt");
const express = require("express");
const app = express();
const router = express.Router();
const client = mqtt.connect("mqtt://broker.mqttdashboard.com");
const Device = require("../models/Device");

const http = require("http");
const { Server } = require("socket.io");
const rfidServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*"
    },
  });
  client.on("connect", function () {
    console.log("Connected");
  });
  client.on("error", function (error) {
    console.log(error);
  });
  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`user disconnect `);
    });
    socket.on("fromclient", function (data) {
      switch (data.message) {
        case "add":
          client.publish(
            "doan/rfid/subcribetopic",
            JSON.stringify({ message: "add" })
          );
          break;
        case "scan":
          client.publish(
            "doan/rfid/subcribetopic",
            JSON.stringify({ message: "scan" })
          );
          break;
        default:
          break;
      }
    });

    // -- read RFID card for add and update
    client.subscribe("doan/rfid/publishtopic/add");
    client.on("message", (topic, message) => {
      // called each time a message is received
      const cardID = message.toString().trim();
      socket.emit("addFromServer", {
        success: true,
        message: "Successfully",
        rfidId: cardID,
      });
    });

    // scan RFID card
    client.subscribe("doan/rfid/publishtopic/scan");
    client.on("message", async (topic, message) => {
      // called each time a message is received
      const cardID = message.toString().trim();
      const data = await Device.find({ rfidId: cardID });
      try {
        if (data[0] != null) {
          socket.emit("scanFromServer", {
            success: true,
            message: "Successfully",
            data: data[0],
          });
        } else {
          const mess = {
            message: "not found",
            rfidId: cardID,
          };
          socket.emit("scanFromServer", {
            success: false,
            message: "Successfully",
            data: cardID,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};
module.exports = rfidServer;
