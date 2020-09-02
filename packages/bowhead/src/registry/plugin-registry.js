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
export { pluginRegistry };