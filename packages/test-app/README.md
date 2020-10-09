# Bowhead

Bowhead Create-React-App template for fast MicroSaas prototyping using the [Bowhead ReactJS component](https://www.npmjs.com/package/@mortond/bowhead).

## Includes

- [ReactJS](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Redux Firebase](https://react-redux-firebase.com/)
- [MaterialUI](https://material-ui.com/)
- [Stripe subscription management](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Firebase authentication](https://firebase.google.com/docs/auth)
- [Firestore database](https://firebase.google.com/docs/firestore)
- [Netlify hosting and functions](https://docs.netlify.com/)

## How to use (macOS)

- Create project using Bowhead CRA template

```bash
npx create-react-app my-app --template @mortond/cra-template-bowhead
```

- Install Firebase CLI https://firebase.google.com/docs/cli

```bash
npm install -g firebase-tools
```

- Install Netlify CLI https://docs.netlify.com/cli/get-started/

```bash
npm install -g netlify-cli
```

- Install Stripe CLI https://stripe.com/docs/stripe-cli

```bash
brew install stripe/stripe-cli/stripe
```

- Rename `.env.sample` to `.env`

```bash
mv .env.sample .env
```

- Rename `.env.functions.sample` to `.env.functions`

```bash
mv .env.functions.sample .env.functions
```

## GitHub

- Go to https://github.com/ and create a new repo for this project, this is required to set up your Netlify project

<div>
  <img src="https://github.com/daithimorton/bowhead/raw/master/packages/test-app/docs/new-github-repo.png" width="50%" />
</div>

## Netlify

- Go to https://app.netlify.com/ and create a project from GitHub

<div>
  <img src="https://github.com/daithimorton/bowhead/raw/master/packages/test-app/docs/netlify-github-project.png" width="100%" />
</div>

- There is no need to fill in all the details, you will be building and deploying this project from your local development environment for now. 

- Build and deploy the functions needed for the Bowhead ReactJS component.

```bash
yarn build:functions
yarn deploy:netlify
```

## Stripe

- Go to `https://dashboard.stripe.com/` and create an account for this project

<div>
  <img src="https://github.com/daithimorton/bowhead/raw/master/packages/test-app/docs/stripe-new-account.png" width="50%" />
</div>

- Create 3 subscription products, e.g. Basic, Pro, Enterprise

<div>
  <img src="https://github.com/daithimorton/bowhead/raw/master/packages/test-app/docs/basic-product.png" width="100%" />
</div>

- Add the price IDs to the `.env` file, check 

```properties
REACT_APP_STRIPE_SUBSCRIPTION_PLAN_BASIC=price_1H306XJ...gt0GNOy1IQS
REACT_APP_STRIPE_SUBSCRIPTION_PLAN_PRO=price_1H307CJF9...gt0ZmRhLsNE
REACT_APP_STRIPE_SUBSCRIPTION_PLAN_ENTERPRISE=price_1H...F9YjhGgt0SxEYD01h
```

- Go to `API Keys` section under `Developers` and copy your accounts `publishable key` to the `.env` file

<div>
  <img src="https://github.com/daithimorton/bowhead/raw/master/packages/test-app/docs/pub-secret-keys.png" width="100%" />
</div>

```properties
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_AGZ3fyOfs2...afdsaAdzyMD00DP2
```

- Copy your accounts `secret key` to the `.env.functions` file


```properties
STRIPE_SECRET_KEY=sk_test_3PfzJ...00ds44323paZ9L
```

- Create a webhook that points to your deployed netlify function e.g. `https://<your-project>.netlify.app/.netlify/functions/webhook-stripe` and configure the following event types

```
customer.subscription.deleted
customer.subscription.updated
customer.subscription.created
checkout.session.completed
```

<div>
  <img src="https://github.com/daithimorton/bowhead/raw/master/packages/test-app/docs/webhook.png" width="100%" />
</div>

- Copy the `webhook signing secret` to the `.env.functions` file

```properties
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_jIPnnfds...fd89jD7lryYmIDHIo
```

## Firebase

- Go to https://console.firebase.google.com/ and create a new project
- Register this app in Firebase
- Create a new `Firestore` database, start in production mode
- Set Authentication sign-in method to `email/password` and enable `Email link`
- Add the projects `*.netlify.app` URL to `Authorized domains`
- Update `./config.js` with your Firebase project configuration

### Backend

- Generate a new Firebase service account private key for this project
- Open the service account `.json` file and copy the environment variable values to `.env`:

```properties
FIREBASE_FIRESTORE_PROD_DATABASE_URL=https://<you-app-url>.com
STRIPE_SECRET_KEY=sk_test_3PZoczJ9M...Dg00zt3paZ9L
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_jIPnnV1DKk...2CojD7lryYmIDHIo
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...lkXctrKM9oOQA=\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-....@...iam.gserviceaccount.com
FIREBASE_PROJECT_ID=<project-id>
```

### CLI

- Run `firebase init` and enable:
  - Firestore
  - Emulators

- Choose `Use an existing project` and select the project you just created
- **DO NOT** overwrite `firestore.rules`
- Run `firebase login:ci`, login with your browser, and copy the `token` to the `.env` file.

### Theming

Bowhead uses MaterialUI which means the UI can styled by registering a new theme and overwriting the CSS based on the generated classes. See: https://material-ui.com/customization/globals/#global-css