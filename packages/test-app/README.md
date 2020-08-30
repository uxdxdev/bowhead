# Bowhead

> The bowhead whale is a species of baleen whale belonging to the family Balaenidae and the only living representative of the genus Balaena. It is the only baleen whale endemic to the Arctic and subarctic waters.

Bowhead is a Create-React-App template for fast MicroSaas prototyping.

## Includes

- [ReactJS](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Redux Firebase](https://react-redux-firebase.com/)
- [MaterialUI](https://material-ui.com/)
- [Stripe subscription management](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Firebase authentication](https://firebase.google.com/docs/auth)
- [Firestore database](https://firebase.google.com/docs/firestore)
- [Netlify hosting and functions](https://docs.netlify.com/)

## How to use

```bash
npx create-react-app my-app --template @mortond/cra-template-bowhead
```

# Setup 

- Install Firebase CLI https://firebase.google.com/docs/cli
- Install Netlify CLI https://docs.netlify.com/cli/get-started/
- Install Stripe CLI https://stripe.com/docs/stripe-cli
- Rename `.env.sample` to `.env`

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

- Copy Firebase project config details to `src/config/frontend/firebaseConfig.js`

### Backend

- Generate a new Firebase service account private key for this project
- Open the service account `.json` file and copy the environment variable values to `.env`:

### CLI

- Run `firebase init` and enable:
  - Firestore
  - Emulators

- Choose `Use an existing project` and select the project you just created
- **DO NOT** overwrite `firestore.rules`
- Run `firebase login:ci`, login with your browser, and copy the `token` to the `.env` file.

## Netlify

- Go to https://app.netlify.com/ and connect this projects `GIT` repo as part of the setup
- Use `yarn app:build:netlify` for build command, and `packages/test-app/build` for publish directory