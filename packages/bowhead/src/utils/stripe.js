import { pluginRegistry, PLUGIN_TYPES } from "../registry/plugin-registry"

const getStripe = () => {
    const stripe = pluginRegistry.getPluginsByType(PLUGIN_TYPES.BOWHEAD_CONFIGURATION)[0]?.config?.stripe
    return stripe
}

export { getStripe };