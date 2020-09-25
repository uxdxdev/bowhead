import { getToken } from '../../utils/firebase'
import { pluginRegistry, PLUGIN_TYPES } from '../../registry/plugin-registry';
import { getStipeCustomerId } from '../../utils/stripe'

const deleteStripeCustomer = async () => {

    const api = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.api

    if (!api || !api.deleteStripeCustomer) {
        console.error(`deleteStripeCustomer API does not exist in bowhead configuration. Plugin: ${PLUGIN_TYPES.CONFIGURATION_BOWHEAD}`)
    }

    const token = await getToken();
    const stripeCustomerId = await getStipeCustomerId();
    return fetch(`${api.deleteStripeCustomer}?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ stripeCustomerId })
    })
}

const createStripeCustomerPortalSession = async () => {
    const api = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.api

    if (!api || !api.createStripeCustomerPortalSession) {
        console.error(`createStripeCustomerPortalSession API does not exist in bowhead configuration.Plugin: ${PLUGIN_TYPES.CONFIGURATION_BOWHEAD}`)
    }

    const token = await getToken();
    const stripeCustomerId = await getStipeCustomerId();
    return fetch(`${api.createStripeCustomerPortalSession}?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ customer: stripeCustomerId })
    }).then(response => response.json())
}

const createStripeCheckoutSession = async ({
    priceId,
    successUrl,
    cancelUrl,
    email,
    uid
}) => {
    const api = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.api

    if (!api || !api.createStripeCheckoutSession) {
        console.error(`createStripeCheckoutSession API does not exist in bowhead configuration.Plugin: ${PLUGIN_TYPES.CONFIGURATION_BOWHEAD}`)
        return;
    }

    const token = await getToken();
    const stripeCustomerId = await getStipeCustomerId();
    return fetch(`${api.createStripeCheckoutSession}?token=${token}`, {
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

export {
    deleteStripeCustomer,
    createStripeCustomerPortalSession,
    createStripeCheckoutSession
}