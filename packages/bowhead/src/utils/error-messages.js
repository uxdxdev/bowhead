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
    createStripeCustomerPortalSession: '/createStripeCustomerPortalSession',
    createStripeCheckoutSession: '/createStripeCheckoutSession'
  },
  ...
}
`

export const noFirebaseConfiguration = `
Please provide an initialised Firebase instance

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  firebase: firebase,
  ...
}
`

export const noStripeConfiguration = `
Please provide a configuration defining the required Stripe subscription data. 

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  stripe: {
    basic: {
      title: "Basic",
      price: "10",
      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_BASIC,
      description: [
        "10 Projects",
        "Live Support",
      ],
      buttonText: "Get started",          
      buttonVariant: "outlined",
    },
    pro: {
      title: "Pro",
      subheader: "Most popular",
      price: "50",
      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_PRO,
      description: [
        "25 Projects",
        "Live Support",
      ],
      buttonText: "Get started",
      buttonVariant: "contained",
    },
    enterprise: {
      title: "Enterprise",
      price: "250",
      priceId: process.env.REACT_APP_STRIPE_SUBSCRIPTION_PLAN_ENTERPRISE,
      description: [
        "125 Projects",
        "Live Support",
      ],
      buttonText: "Get started",
      buttonVariant: "outlined",
    }
  }
  ...
}
`