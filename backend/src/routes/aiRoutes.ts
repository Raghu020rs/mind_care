import express from 'express';
import { mentalHealthChat } from '../controllers/aiController';

const router = express.Router();

router.post('/chat', mentalHealthChat);

export default router;
