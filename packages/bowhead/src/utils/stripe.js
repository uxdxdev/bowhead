import { pluginRegistry, PLUGIN_TYPES } from "../registry/plugin-registry"

const getStripe = () => {
    const stripe = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.stripe
    return stripe
}

export { getStripe };