import admin from 'firebase-admin';

const firebase = (config) => {

    const projectId = config.projectId
    const privateKey = config.privateKey
    const clientEmail = config.clientEmail
    const databaseProductionUrl = config.databaseProductionUrl

    if (admin.apps && !admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                "project_id": projectId,
                "private_key": privateKey?.replace(/\\n/g, '\n'),
                "client_email": clientEmail
            }),
            databaseURL: databaseProductionUrl
        });

        if (process.env.NODE_ENV === 'development') {
            admin.firestore().settings({
                host: "localhost:8080",
                ssl: false
            });
        }
    }


    const verifyToken = async (idToken) => {
        try {
            let decodedToken = await admin.auth().verifyIdToken(idToken)
            return decodedToken
        } catch (err) {
            // invalid token
            return null
        }
    }

    const firestore = admin.firestore();

    return { firestore, verifyToken }
}


export { firebase };
