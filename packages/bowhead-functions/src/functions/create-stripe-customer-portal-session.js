import { stripe } from '../utils/stripeBackend'
import { verifyToken } from '../utils/firebaseBackend';

export const createStripeCustomerPortalSession = async ({ token, body }) => {
    const user = await verifyToken(token);
    if (!user) return { error: 'Error: request unauthorised', data: { statusCode: 401 } }

    const data = JSON.parse(body);

    return await stripe.billingPortal.sessions.create(data).then((session) => session);
}