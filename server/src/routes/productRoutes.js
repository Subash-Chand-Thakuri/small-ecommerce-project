import express from "express";
import {
  getProducts,
} from "../controllers/productCtrl.js";
import { getProductById } from "../controllers/productCtrl.js";

const router = express.Router();  

router.get('/', getProducts); 
router.get('/:id', getProductById); 


export default router;