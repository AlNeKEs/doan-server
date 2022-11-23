const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const verifyToken = require("../middleware/auth");

//@route POST api/device/add
//@access Private
router.post("/add", verifyToken, async (req, res) => {
  const { rfidId, deviceName, type, deviceModel, manufactor, mfg, exp } =
    req.body;
  if (!rfidId || !deviceName)
    return res
      .status(400)
      .json({ success: false, message: "missing rfidID and/or deviceName" });
  try {
    const searchDevice = await Device.findOne({ rfidId: rfidId });
    console.log(searchDevice);
    if (searchDevice)
      return res
        .status(409)
        .json({ success: false, message: "Device already exists" });
    else{
      const newDevice = new Device({
        rfidId,
        deviceName,
        type,
        deviceModel,
        manufactor,
        mfg,
        exp,
        createBy: req.userId,
        createAt: new Date(),
        dateModified: new Date(),
      });
      await newDevice.save();
      res.json({ success: true, message: "Successfully", device: newDevice });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route POST api/device/getDevice
//@access Private
router.post("/getDevice", verifyToken, async (req, res) => {
  const { searchValue } = req.body;
  console.log(searchValue);
  try {
    if (!searchValue) {
      const devices = await Device.find({});
      res.json({ success: true, devices });
    } else {
      const searchByName = await Device.find({ deviceName: searchValue });
      const searchByIdTag = await Device.find({ rfidId: searchValue });
      const searchByIdType = await Device.find({ type: searchValue });
      const data = {
        ...searchByName.concat(searchByIdTag.concat(searchByIdType)),
      };
      const devices = Object.values(data);

      res.json({ success: true, devices });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route GET api/device/getDetail/_id
//@access Private
router.get("/getDetail/:id", verifyToken, async (req, res) => {
  try {
    const device = await Device.find({ _id: req.params.id });
    res.json({ success: true, device });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route PUT api/device/update
//@access Private
router.put("/update", verifyToken, async (req, res) => {
  const {
    id,
    rfidId,
    deviceName,
    type,
    deviceModel,
    manufactor,
    mfg,
    exp,
    createAt,
  } = req.body;
  if (!rfidId || !deviceName)
    return res
      .status(400)
      .json({ success: false, message: "missing rfidID and/or deviceName" });
  try {
    const updateData = {
      _id: id,
      rfidId: rfidId,
      deviceName: deviceName,
      type: type,
      deviceModel: deviceModel,
      manufactor: manufactor,
      mfg: mfg,
      exp: exp,
      createBy: req.userId,
      createAt: createAt,
      dateModified: new Date(),
    };
    const updateDevice = await Device.findByIdAndUpdate(
      updateData._id,
      updateData
    );
    if (updateDevice)
      return res.json({ success: true, message: "Update successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route DEL api/device/delete
//@access Private
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    // const deleteId = {_id: };
    const deleteDevice = await Device.findOneAndDelete({ _id: req.params.id });
    console.log(deleteDevice);
    res.json({ success: true, message: "delete successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
