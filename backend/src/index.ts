
import express from "express";
import { userRouter } from "./router/user";
import { todoRouter } from "./router/todo";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1/user", userRouter);

app.use("/api/v1/todos", todoRouter);


app.listen(3000);
