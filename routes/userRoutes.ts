import { Router } from 'express';
import { authLogin, authRegistration, fetchUserDataController, updateUserDataController } from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Route to fetch user data (protected)
router.get('/fetch-user-data', authMiddleware, fetchUserDataController);

// Route to update user data (protected)
router.put('update-user-data', authMiddleware, updateUserDataController);

router.post('/registration', authRegistration)
router.post('/login', authLogin)
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

export default router;
