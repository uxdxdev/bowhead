import { getToken } from '../../utils/firebaseFrontend'

export const deleteStripeCustomerAndSubscription = async (stripeCustomerId) => {
    const token = await getToken();
    return fetch(`/.netlify/functions/delete-stripe-customer?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ stripeCustomerId })
    })
}

export const createStripeCustomerPortalSession = async (stripeCustomerId) => {
    const token = await getToken();
    return fetch(`/.netlify/functions/create-stripe-customer-portal-session?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ customer: stripeCustomerId })
    }).then(response => response.json())
}

export const createStripeCheckoutSession = async ({
    stripeCustomerId,
    priceId,
    successUrl,
    cancelUrl,
    email,
    uid
}) => {
    const token = await getToken();
    return fetch(`/.netlify/functions/create-stripe-checkout-session?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({
            ...(stripeCustomerId && { customer: stripeCustomerId }),
            payment_method_types: ['card'],
            line_items: [
                { price: priceId, quantity: 1 }
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            ...(!stripeCustomerId && { customer_email: email }),
            client_reference_id: uid,
            subscription_data: {
                trial_period_days: '14'
            }
        })
    }).then(response => response.json())
}