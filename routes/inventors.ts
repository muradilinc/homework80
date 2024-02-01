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
      'INSERT INTO item (category_id, location_id, name, description, delivery, image)' +
      'VALUES (?, ?, ?, ?, ?, ?)',
      [item.categoryId, item.locationId, item.name, item.description, item.delivery, item.image],
    ) as ResultSetHeader[];

    res.send({
      id: result.insertId,
      ...item,
    });
  }catch (error) {
    return next(error);
  }
});

inventorsRouter.get('/', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query('SELECT * FROM item');
    res.send(results);
  } catch (error) {
    return next(error);
  }
});

inventorsRouter.get('/:id', async (req, res, next) => {
  try {
    const [results] = await mysqlDb.getConnection().query(
      'SELECT item.name, item.description, delivery, image, c.title category_title, l.name location FROM item LEFT JOIN inventories.categories c on item.category_id = c.id LEFT JOIN inventories.location l on l.id = item.location_id WHERE item.id = ?',
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

export default inventorsRouter;