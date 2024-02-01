import express from 'express';
import inventorsRouter from "./routes/inventors";
import mysqlDb from "./helpers/mysqlConnect";

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use('/inventors', inventorsRouter);

const run = async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log('we r online, port: ' + port);
  });
};

void run();

