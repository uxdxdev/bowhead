import BowheadFunctions from '@mortond/bowhead-functions'

const config = {
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        databaseProductionUrl: process.env.FIREBASE_FIRESTORE_PROD_DATABASE_URL,
    },
    stripe: {
        stripeWebhookSigningSecret: process.env.STRIPE_WEBHOOK_SIGNING_SECRET,
        stripeSecretKey: process.env.STRIPE_SECRET_KEY
    }
}

const bowhead = new BowheadFunctions(config);
export { bowhead };