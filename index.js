require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/auth");
const deviceRouter = require("./routes/device");
const rfidServer = require("./routes/rfid");

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
rfidServer(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
