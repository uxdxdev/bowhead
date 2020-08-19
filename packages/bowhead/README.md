# Bowhead

Boilerplate for React app + Netlify + Firebase + Stripe

# Setup 

- Install Firebase CLI https://firebase.google.com/docs/cli
- Install Netlify CLI https://docs.netlify.com/cli/get-started/
- Install Stripe CLI https://stripe.com/docs/stripe-cli
- Rename `env.sample` to `.env`

## Stripe

- Go to `https://dashboard.stripe.com/` and create an account for this project
- Create 3 subscription products, e.g. Basic, Pro, Enterprise and add the IDs to the `.env` file, check the `Products` section
- Copy your accounts `publishable key` and `secret key` to the `.env` file, check the `API Keys` section under `Developers`
- Create a webhook that points to `https://<your-project>.netlify.app/.netlify/functions/webhook-stripe` and copy the signing secret to the `.env` file

## Firebase

- Go to https://console.firebase.google.com/ and create a new project
- Register app in Firebase
- Create a new `Firestore` database, start in production mode
- Set Authentication sign-in method to `email/password` and enable `Email link`
- Add the projects `*.netlify.app` URL to `Authorized domains`

### Frontend

- Copy Firebase config to `src/config/frontend/firebaseConfig.js`

### Backend

- Generate a new Firebase service account private key for this project
- Open the service account `.json` file and copy the values for environment these variables to `.env`:
  - FIREBASE_PROJECT_ID
  - FIREBASE_PRIVATE_KEY
  - FIREBASE_CLIENT_EMAIL

### CLI

- Run `firebase init` and enable:
  - Firestore
  - Emulators

- Choose `Use an existing project` and select the project you just created
- Do not overwrite `firestore.rules`, and continue with the rest of the setup as normal
- Run `firebase login:ci`, login with your browser, and copy the `token` to the `.env` file.

## Netlify

- Go to https://app.netlify.com/ and connect this projects `GIT` repo as part of the setup
- Use `yarn build` for build command, and `build/` for publish directory

# Notes

Start a local Stripe webhook event listener

`stripe listen --forward-to localhost:8888/.netlify/functions/stripe` 

Trigger a Stripe event

`stripe trigger customer.subscription.created`

List of Stripe events

https://stripe.com/docs/api/events/types

Netlify 404 page solution, add `_redirects` to `public` directory

```bash
/*    /index.html   200
```

To use firebase SDK in functions

```javascript
//./config/webpack.functions.js
const nodeExternals = require('webpack-node-externals');

module.exports = {
  externals: [nodeExternals()],
};
```
update `package.json`

```javascript
"scripts": {
    "build:lambda": "netlify-lambda build --config ./config/webpack.functions.js src/lambda",
    "start:lambda": "netlify-lambda serve --config ./config/webpack.functions.js src/lambda"
  },
```
Frontend `NODE_ENV` set to `development` in CRA, but Netlify Dev sets it to `production`. So we need to use a custom env variable for the backend functions

```javascript
FIREBASE_ENV_FLAG=development
```

Import Firebase emulator data

```javascript
firebase emulators:start --import=./data --only firestore
```
