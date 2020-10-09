export const noAppName = `
Please provide a name for your application. 

See: https://github.com/daithimorton/bowhead

Example:

const bowheadConfig = {
    app: {
      name: 'Bowhead app'
    },
    ...
}
`

export const noProductionUrl = `
Production URL is not provided in Bowhead configuration. When this app is deployed, users who are signing in will not be correctly verified. Please provide the URL of the deployed application. 

See: https://github.com/daithimorton/bowhead

Example:

const bowheadConfig = {
    app: {
      productionUrl: https://your-awesome-app.com
    },
    ...
}
`

export const noApiConfiguration = `
Please provide a configuration defining the required API endpoints. 

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  api: {
    deleteStripeCustomer: '/deleteStripeCustomer',
    createStripeCustomerPortalSession: '/createStripeCustomerPortalSession',
    createStripeCheckoutSession: '/createStripeCheckoutSession'
  },
  ...
}
`

export const noFirebaseInstance = `
Please provide an initialised Firebase instance

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  firebase: firebase,
  ...
}
`

export const noFirestoreInstance = `
Please provide an initialised Firestore instance

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  firestore: firestore,
  ...
}
`

export const noStripeInstance = `
Please provide an initialised Stripe instance

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  stripe: stripe,
  ...
}
`

export const noStripeConfiguration = `
Please provide a configuration defining the required Stripe subscription data. 

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  plans: [
    {
      title: "Basic",
      price: "10",
      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_BASIC,
      description: [
        "1 Workspace",
        "1 Project/pw"
      ],
      buttonText: "Get started",
      // button variant uses MaterialUI variants 
      // https://material-ui.com/api/button/#props
      buttonVariant: "outlined",
    },
    {
      title: "Pro",
      subheader: "Most popular",
      price: "50",
      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_PRO,
      description: [
        "5 Workspaces",
        "5 Projects/pw"
      ],
      buttonText: "Get started",
      buttonVariant: "contained",
    },
    {
      title: "Enterprise",
      price: "250",
      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_ENTERPRISE,
      description: [
        "25 Workspaces",
        "25 Projects/pw"
      ],
      buttonText: "Get started",
      buttonVariant: "outlined",
    }
  ]
  ...
}
`