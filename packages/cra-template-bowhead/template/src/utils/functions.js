import BowheadFunctions from '@mortond/bowhead-functions'

const config = {
    firebase: {
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
        databaseProductionUrl: process.env.REACT_APP_FIREBASE_FIRESTORE_PROD_DATABASE_URL,
    },
    stripe: {
        stripeWebhookSigningSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SIGNING_SECRET,
        stripeSecretKey: process.env.REACT_APP_STRIPE_SECRET_KEY
    }
}

const functions = new BowheadFunctions(config);
export { functions };