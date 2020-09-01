import { stripe } from '../utils/stripeBackend'
import { verifyToken } from '../utils/firebaseBackend';

export const deleteStripeCustomer = async ({ token, body }) => {
    const user = await verifyToken(token);
    if (!user) return { error: 'Error: request unauthorised', data: { statusCode: 401 } }

    const { stripeCustomerId } = JSON.parse(body);
    return await stripe.customers.del(stripeCustomerId);
}