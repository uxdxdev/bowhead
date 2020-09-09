import { loadStripe } from '@stripe/stripe-js';

const getStripe = async () => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    return stripe;
}


export { getStripe };