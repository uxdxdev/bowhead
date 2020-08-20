const sh = require('shelljs')

require('dotenv').config()

if (sh.exec(`firebase deploy --only firestore:rules --token '${process.env.FIREBASE_TOKEN}' --project ${process.env.FIREBASE_PROJECT_ID} --non-interactive`).code !== 0) {
    sh.echo('Error: Firebase deploy falied');
    sh.exit(1);
}