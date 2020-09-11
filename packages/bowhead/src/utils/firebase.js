import { pluginRegistry, PLUGIN_TYPES } from "../registry/plugin-registry"

const getFirebase = () => {
  const firebase = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.firebase
  return firebase
}

const getFirestore = () => {
  const firestore = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.firestore
  return firestore;
}

const getToken = () => {
  const firebase = getFirebase();
  return firebase.auth().currentUser.getIdToken();
}

export { getFirebase, getToken, getFirestore };
