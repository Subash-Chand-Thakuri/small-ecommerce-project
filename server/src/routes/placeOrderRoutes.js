import express from "express";
import { getPlaceOrder } from "../controllers/placeOrderCtrl.js";

const router = express.Router();  

router.post('/', getPlaceOrder); 


export default router;