import express from 'express';
import inventorsRouter from "./routes/inventors";
import mysql from "mysql2/promise";
import config from "./config";

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use('/inventors', inventorsRouter);

const run = async () => {
  const connection = await mysql.createConnection(config.mysql);

  app.listen(port, () => {
    console.log('we r online, port: ' + port);
  });
};

void run();

