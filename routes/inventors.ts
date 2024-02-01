import {Router} from "express";
import {imagesUpload} from "../helpers/multer";

const inventorsRouter = Router();

inventorsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {

});

inventorsRouter.get('/', async (req, res, next) => {
  try {

  } catch (error) {
    next(error);
  }
})

export default inventorsRouter;