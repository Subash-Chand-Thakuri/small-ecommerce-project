import express from "express";
import { getCourierChargeById, getCourierCharges } from "../controllers/courierChargesCtrl.js";

const router = express.Router();  

router.get('/', getCourierCharges); 
router.get('/:id', getCourierChargeById); 


export default router;