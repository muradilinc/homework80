import {Router} from "express";
import mysqlDb from "../helpers/mysqlConnect";
import {Location} from "../types";
import {ResultSetHeader, RowDataPacket} from "mysql2";

const locationsRouter = Router();

locationsRouter.post('/', async (req, res, next) => {
  try {
    const location: Location = {
      name: req.body.name,
      description: req.body.description,
    };

    const [results] = await mysqlDb.getConnection().query(
      'INSERT INTO locations (name, description) VALUES (?, ?)',
      [location.name, location.description],
    ) as ResultSetHeader[];

    res.send({
      id: results.insertId,
      ...location,
    });
  } catch (error) {
    return next(error);
  }
});

locationsRouter.get('/', async (req, res, next) => {
  const [results] = await mysqlDb.getConnection().query('SELECT * FROM locations');
  res.send(results);
});

locationsRouter.get('/:id', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'SELECT * FROM locations WHERE id = ?',
      [req.params.id],
    ) as RowDataPacket[];

    res.send(results);
  } catch (error) {
    return next(error);
  }
});

locationsRouter.put('/:id', async (req, res, next) => {
  try {
    const location: Location = {
      name: req.body.name,
      description: req.body.description,
    };

    const updateFields = Object.entries(location)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key} = ?`)
      .join(', ');

    if (updateFields) {
      const query = `UPDATE locations SET ${updateFields} WHERE id = ?`;
      const values = Object.values(location).filter(value => value);
      values.push(req.params.id);

      const [results] = await mysqlDb.getConnection().query(query, values) as ResultSetHeader[];
      res.send(results.info);
    }

  } catch (error) {
    return next(error);
  }
});

locationsRouter.delete('/:id', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'DELETE FROM locations WHERE id = ?',
      [req.params.id],
    ) as ResultSetHeader[];

    res.send('delete location ' + results.insertId);
  } catch (error) {
    return next(error);
  }
});

export default locationsRouter;