const PLUGIN_TYPES = {
    ROUTE_UNAUTHENTICATED: 'plugin-type-route-unauthenticated',
    ROUTE_AUTHENTICATED: 'plugin-type-route-authenticated',
    LINK_POPOVER: 'plugin-type-link-popover',
    LINK_SIDEBAR: 'plugin-type-link-sidebar',
    LINK_LANDING_PAGE_NAV: 'plugin-type-link-landing-page',
    REDUCER: 'plugin-type-reducer',
    THEME: 'plugin-type-theme',
    LISTENER_FIRESTORE: 'plugin-type-listener-firestore',
    CONFIGURATION_BOWHEAD: 'plugin-type-configuration-bowhead'
};

class PluginRegistry {
    constructor() {
        this.plugins = {};
        this.listeners = [];
    }

    getPluginsByType(type) {
        return Object.values(this.plugins).filter(plugin => plugin.type === type);
    }

    register(name, plugin) {
        if (!name || !plugin) {
            console.error(`All plugins must have a unique name and plugin configuration. Name: ${name}`, plugin)
            return;
        }
        if (!plugin.type || !Object.values(PLUGIN_TYPES).includes(plugin.type)) {
            console.error(`Plugin configurations must be one of pluginRegistry.PLUGIN_TYPES. Name: ${name}`, plugin)
            return;
        }
        this.plugins[`${plugin.type}-${name}`] = plugin;
        if (this.listeners.length > 0) {
            const plugins = Object.values(this.plugins)
            this.listeners.forEach(listener => listener(plugins))
        }
    }

    setChangeListener(listener) {
        this.listeners.push(listener);
    }

    removeChangeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
}

const pluginRegistry = new PluginRegistry();

export { PLUGIN_TYPES, pluginRegistry };