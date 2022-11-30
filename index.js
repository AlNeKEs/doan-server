require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/auth");
const deviceRouter = require("./routes/device");
const readDevice = require ("./routes/rfid");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@doanrfid.bf9uuoj.mongodb.net/?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}; 

connectDB();

app.use(express.json());
app.use(cors({
  origin: "*"
}));

app.use("/api/auth", authRouter);
app.use("/api/device", deviceRouter);
app.use("/api/rfid", readDevice);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
