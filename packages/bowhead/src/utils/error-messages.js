

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
pluginRegistry.register('bowhead-configuration', {
  type: PLUGIN_TYPES.BOWHEAD_CONFIGURATION,
  config: bowheadConfig
})
`

export const noFirebaseConfiguration = `
Please provide an initialised Firebase instance

See: https://github.com/daithimorton/bowhead
    
Example: 

const bowheadConfig = {
  firebase: firebase,
  ...
}
pluginRegistry.register('bowhead-configuration', {
  type: PLUGIN_TYPES.BOWHEAD_CONFIGURATION,
  config: bowheadConfig
})
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
        "Unlimited Users",
        "Live Support",
        "14 Day Free Trial",
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
        "Unlimited Users",
        "Live Support",
        "14 Day Free Trial",
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
        "Unlimited Users",
        "Live Support",
        "14 Day Free Trial",
      ],
      buttonText: "Get started",
      buttonVariant: "outlined",
    }
  }
  ...
}
pluginRegistry.register('bowhead-configuration', {
  type: PLUGIN_TYPES.BOWHEAD_CONFIGURATION,
  config: bowheadConfig
})
`