const PLUGIN_TYPES = {
    UNAUTHENTICATED_ROUTE: 'plugin-type-unauthenticated-route',
    AUTHENTICATED_ROUTE: 'plugin-type-authenticated-route',
    MENU_ITEM_POPOVER: 'plugin-type-menu-item-popover',
    MENU_ITEM_SIDEBAR: 'plugin-type-menu-item-SIDEBAR',
    REDUCER: 'plugin-type-reducer',
    THEME: 'plugin-type-theme',
    FIRESTORE_LISTENER: 'plugin-type-firestore-listener',
    BOWHEAD_API_CONFIGURATION: 'plugin-type-bowhead-configuration',
    CUSTOM: 'plugin-type-custom'
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
}

const pluginRegistry = new PluginRegistry();

export { PLUGIN_TYPES, pluginRegistry };