import { Response } from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getUserById, loginUserService, registrationUser, updateUserData } from "../repository/userCollection";
import { User } from '../entities/user';
/**
 * Fetch User Data Controller
 */
export const fetchUserDataController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const userData = await getUserById(uid);
        if (!userData) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
* Update User Data Controller
*/
export const updateUserDataController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.uid;
        const userData = req.body; // Assuming you are passing the updated data via body

        if (!uid) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        await updateUserData(uid, userData);

        res.status(200).json({ message: 'User data updated successfully.' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
* Update User Data Controller
*/

export const authRegistration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { email, password, displayName } = req.body;
        const params = req.body
        const result = await registrationUser({ email, password, displayName });

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        res.status(201).json({ message: 'User registered successfully', user: result.user,idToken:result.idToken });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const authLogin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        console.log("FIREBASE_API_KEY : ", process.env.FIREBASE_API_KEY)
        const result = await loginUserService(email, password);

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            token: result.token,
            refreshToken: result.refreshToken,
            uid: result.uid,
            data:result.data
        });
    } catch (error) {
        console.error('Login controller error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};