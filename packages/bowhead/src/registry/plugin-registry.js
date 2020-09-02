export class PluginRegistry {
    constructor() {
        this.plugins = [];
        this.listeners = [];
    }

    getPluginsByType(type) {
        return this.plugins.filter(plugin => plugin.type === type);
    }

    register(plugin) {
        this.plugins.push(plugin)
        if (this.listeners.length > 0) {
            this.listeners.forEach(listener => listener(this.plugins))
        }
    }

    setChangeListener(listener) {
        this.listeners.push(listener);
    }
}

const pluginRegistry = new PluginRegistry();
export { pluginRegistry };