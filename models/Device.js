const mongoose = require('mongoose');
const Schema = mongoose.Schema

const DeviceSchema = new Schema({
    rfidId: {
        type: String,
        required: true,
        unique: true
    },
    deviceName: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    deviceModel: {
        type: String
    },
    manufactor: {
        type: String
    },
    mfg: {
        type: String
    },
    exp: {
        type: String
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    createBy:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createAt: {
        type: Date
    }
})
module.exports = mongoose.model('devices', DeviceSchema);