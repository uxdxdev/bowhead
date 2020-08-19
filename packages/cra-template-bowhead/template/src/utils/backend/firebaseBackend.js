import * as admin from 'firebase-admin';
import { firebaseConfig } from '../../config/frontend/firebaseConfig';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            "project_id": process.env.FIREBASE_PROJECT_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            "client_email": process.env.FIREBASE_CLIENT_EMAIL
        }),
        databaseURL: firebaseConfig.databaseURL
    });

    if (process.env.REACT_APP_FIREBASE_ENV_FLAG === 'development') {
        admin.firestore().settings({
            host: "localhost:8080",
            ssl: false
        });
    }
}

const firestore = admin.firestore();

const verifyToken = async (idToken) => {
    try {
        let decodedToken = await admin.auth().verifyIdToken(idToken)
        return decodedToken
    } catch (err) {
        // invalid token
        return null
    }
}

export { firestore, admin, verifyToken };
