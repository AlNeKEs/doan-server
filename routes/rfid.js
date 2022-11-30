const express = require("express");
const router = express.Router();
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.mqttdashboard.com");
const Device = require("../models/Device");
const verifyToken = require("../middleware/auth");

client.on("connect", function () {
  console.log("Connected");
});
client.on("error", function (error) {
  console.log(error);
});

router.get("/add", verifyToken, (req, res) => {
  client.subscribe("doan/rfid/publishtopic/add", { qos: 0 }, (e) => {
    if (e) {
      console.log(e);
    }
  });
  client.on("message", (topic, message) => {
    if (res) {
      res.json({
        success: true,
        message: "Successfully",
        rfidId: message.toString().trim(),
      });
      client.unsubscribe("doan/rfid/publishtopic/add");
      res = undefined;
    }
  });
});

router.get("/scan", verifyToken, (req, res) => {
  client.subscribe("doan/rfid/publishtopic/scan", { qos: 0 }, (e) => {
    if (e) {
      console.log(e);
    }
  });
  client.on("message", async (topic, message) => {
    if (res) {
      const device = await Device.find({ rfidId: message.toString().trim() });
      if (device[0] != null) {
        res.json({
          success: true,
          message: "Successfully",
          data: device[0],
        });
        client.unsubscribe("doan/rfid/publishtopic/scan");
      } else {
        res.json({
          success: false,
          message: "Device not found",
          rfidId: message.toString().trim(),
        });
      }
    }
    res = undefined;
  });
});

module.exports = router;
