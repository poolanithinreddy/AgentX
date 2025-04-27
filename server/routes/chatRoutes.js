import express from 'express';
import { sendMessageToAI } from '../controllers/chatController.js';

const router = express.Router();
router.post('/message', sendMessageToAI);
export default router;
