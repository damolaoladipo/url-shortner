import express from "express";
import { validateChannels as vcd } from "../../../middleware/header.mdw";
import { register } from "../../../controllers/auth.controllers";


const router = express.Router({ mergeParams: true });

router.post("/register", vcd, register);

export default router;
