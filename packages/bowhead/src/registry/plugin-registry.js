const PLUGIN_TYPES = {
    UNAUTHENTICATED_ROUTE: 'plugin-type-unauthenticated-route',
    AUTHENTICATED_ROUTE: 'plugin-type-authenticated-route',
    MENU_ITEM: {
        POP_OVER: 'plugin-type-menu-item-popover',
        SIDEBAR: 'plugin-type-menu-item-sidebar'
    },
    REDUCER: 'plugin-type-reducer',
    THEME: 'plugin-type-theme',
    FIRESTORE_LISTENER: 'plugin-type-firestore-listener'
};

export class PluginRegistry {
    constructor() {
        this.plugins = {};
        this.listeners = [];
    }

    getPluginsByType(type) {
        return Object.values(this.plugins).filter(plugin => plugin.type === type);
    }

    register(name, plugin) {
        this.plugins[`${plugin.type}-${name}`] = plugin;
        if (this.listeners.length > 0) {
            const pluginData = Object.values(this.plugins)
            this.listeners.forEach(listener => listener(pluginData))
        }
    }

    setChangeListener(listener) {
        this.listeners.push(listener);
    }
}

const pluginRegistry = new PluginRegistry();

export { PLUGIN_TYPES, pluginRegistry };