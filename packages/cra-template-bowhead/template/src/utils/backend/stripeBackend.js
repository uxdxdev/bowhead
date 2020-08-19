import Stripe from 'stripe'

const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY, {
    maxNetworkRetries: 3, // Retry a request X times before giving up
});

export { stripe };