import {Router} from "express";
import {imagesUpload} from "../helpers/multer";
import mysqlDb from "../helpers/mysqlConnect";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Item} from "../types";

const inventorsRouter = Router();

inventorsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const item: Item = {
      name: req.body.name,
      categoryId: parseInt(req.body.categoryId),
      locationId: parseInt(req.body.locationId),
      description: req.body.description,
      delivery: req.body.delivery,
      image: req.file ? req.file.filename : null,
    };

    const [result] = await mysqlDb.getConnection().query(
      'INSERT INTO items (category_id, location_id, name, description, delivery, image)' +
      'VALUES (?, ?, ?, ?, ?, ?)',
      [item.categoryId, item.locationId, item.name, item.description, item.delivery, item.image],
    ) as ResultSetHeader[];

    res.send({
      id: result.insertId,
      ...item,
    });
  } catch (error) {
    return next(error);
  }
});

inventorsRouter.get('/', async (_, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query('SELECT * FROM items');
    res.send(results);
  } catch (error) {
    return next(error);
  }
});

inventorsRouter.get('/:id', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'SELECT items.name, items.description, delivery, image, c.title category_title, l.name location FROM items LEFT JOIN inventories.categories c on items.category_id = c.id LEFT JOIN inventories.locations l on l.id = items.location_id WHERE items.id = ?',
      [req.params.id]
    ) as RowDataPacket[];

    const item = results[0];

    if (!item) {
      return res.status(404).send({error: 'Not found !'});
    }

    res.send(item);
  } catch (error) {
    return next(error);
  }
});

inventorsRouter.put('/:id', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const item: Item = {
      name: req.body.name,
      categoryId: parseInt(req.body.categoryId),
      locationId: parseInt(req.body.locationId),
      description: req.body.description,
      delivery: req.body.delivery,
      image: req.file ? req.file.filename : null,
    };

    const updateFields = Object.entries(item)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key === 'categoryId' ? 'category_id' : key && key === 'locationId' ? 'location_id': key} = ?`)
      .join(', ');

    if (updateFields) {
      const query = `UPDATE items SET ${updateFields} WHERE id = ?`;
      const values = Object.values(item).filter(value => value);
      values.push(req.params.id);

      const [results] = await mysqlDb.getConnection().query(query, values) as ResultSetHeader[];
      res.send(results.info);
    }
  } catch (error) {
    return next(error);
  }
});

inventorsRouter.delete('/:id', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'DELETE FROM items WHERE id = ?',
      [req.params.id],
    ) as ResultSetHeader[];

    res.send('delete item ' + results.insertId);
  } catch (error) {
    return next(error);
  }
})

export default inventorsRouter;