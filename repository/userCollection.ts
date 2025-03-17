import { Response } from 'express';
import { db } from "../config/firebaseConfig";
import { User } from "../entities/user";
import { getAuth } from 'firebase-admin/auth';
import axios from 'axios';

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const userDoc = await db.collection('USERS').doc(userId).get();

        if (!userDoc.exists) {
            return null; // User not found
        }

        const userData = userDoc.data() as Omit<User, 'uid'>; // Everything except 'id'
        return {
            uid: userDoc.id,
            ...userData,
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUserData = async (userId: string, updatedData: Partial<Omit<User, 'uid'>>): Promise<void> => {
    try {
        // Update user document in Firestore
        await db.collection('USERS').doc(userId).update(updatedData);
        console.log(`User with uid ${userId} successfully updated.`);
    } catch (error) {
        console.error(`Error updating user with uid ${userId}:`, error);
        throw error;
    }
};

// name: string;
//     email: string;
//     phone: string;
//     address: string;

export const registrationUser = async (form: { email: string; password: string; displayName: string; }) => {
    try {
        const userRecord = await getAuth().createUser(form);
        console.log("userRecord : ", userRecord)
        await db.collection('USERS').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || '',
            createdAt: new Date(),
        });

        const loginResponse = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email: form.email,
                password: form.password,
                returnSecureToken: true,
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const idToken = loginResponse.data.idToken;

        // ✅ Success with token
        return { success: true, user: userRecord, idToken };
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            return { success: false, message: 'Email already exists' };
        }
        throw error; // Other errors will be handled outside
    }
}

export const loginUserService = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const { idToken, refreshToken, localId, } = response.data;
        console.log("===> ", response.data)
        return {
            success: true,
            message: 'Login successful',
            token: idToken, // this is the Firebase ID Token (JWT)
            refreshToken,
            uid: localId,
            data: {
                email: response.data.email,
                displayName: response.data.displayName
            }
        };
    } catch (error: any) {
        console.error('Login Error:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.error?.message || 'Login failed',
        };
    }
};
