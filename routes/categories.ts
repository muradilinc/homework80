import {Router} from "express";
import mysqlDb from "../helpers/mysqlConnect";
import {Category} from "../types";
import {ResultSetHeader, RowDataPacket} from "mysql2";

const categoriesRouter = Router();

categoriesRouter.post('/', async (req, res, next) => {
  try {
    const category: Category = {
      title: req.body.title,
      description: req.body.description,
    };

    const [results] = await mysqlDb.getConnection().query(
      'INSERT INTO categories (title, description) VALUES (?, ?)',
      [category.title, category.description],
    ) as ResultSetHeader[];

    res.send({
      id: results.insertId,
      ...category,
    });
  } catch (error) {
    return next(error);
  }
});

categoriesRouter.get('/', async (req, res, next) => {
  const [results] = await mysqlDb.getConnection().query('SELECT * FROM categories');
  res.send(results);
});

categoriesRouter.get('/:id', async (req, res, next) => {
  const [results] = await mysqlDb.getConnection().query(
    'SELECT * FROM categories WHERE id = ?',
    [req.params.id],
  ) as RowDataPacket[];

  res.send(results);
});

categoriesRouter.put('/:id', async (req, res, next) => {
  try {
    const category: Category = {
      title: req.body.title,
      description: req.body.description,
    };

    const updateFields = Object.entries(category)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key} = ?`)
      .join(', ');

    if (updateFields) {
      const query = `UPDATE categories SET ${updateFields} WHERE id = ?`;
      const values = Object.values(category).filter(value => value);
      values.push(req.params.id);

      const [results] = await mysqlDb.getConnection().query(query, values) as ResultSetHeader[];
      res.send(results.info);
    }
  } catch (error) {
    return next(error);
  }
})

categoriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'DELETE FROM categories WHERE id = ?',
      [req.params.id],
    ) as ResultSetHeader[];

    res.send('delete categories ' + results.insertId);
  } catch (error) {
    return next(error);
  }
});

export default categoriesRouter;