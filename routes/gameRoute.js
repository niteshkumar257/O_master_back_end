import express from "express";
import { rollDice,updatePoints,getPoints, getAllGames} from "../controller/gameController.js";
const router=express.Router();

router.post('/roll', rollDice);
router.get('/getPoints/:user_id',getPoints);
router.patch('/points/:user_id', updatePoints);
router.get('/allGames/:user_id',getAllGames)

export default router;

