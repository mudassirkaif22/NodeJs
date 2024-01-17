import express, { json, urlencoded } from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import nominationRouter from "./routes/awardsRouter.js";
import awardsTypeRouter from "./routes/awardsTypeRouter.js";
import probationRouter from "./routes/probationRouter.js";

const app = express();

import dotenv from "dotenv";
dotenv.config();

app.use(cors());
//it parses incoming json data from HTTP request
app.use(json());
app.use("/uploads", express.static("uploads"));
app.use(urlencoded({ extended: true }));
// routers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/nominate", nominationRouter);
app.use("/api/award", awardsTypeRouter);
app.use("/api/probation", probationRouter);

//port
const PORT = process.env.PORT;

//server
app.listen(PORT, () => {
  console.log(`server is running on port  http://localhost:${PORT}`);
});
