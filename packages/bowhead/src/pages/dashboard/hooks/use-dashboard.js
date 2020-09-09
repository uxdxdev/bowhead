import { useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import { STRIPE_SUBSCRIPTION_STATUS, FIRESTORE_COLLECTIONS } from "../../../utils/constants";
import { useFirestoreConnect } from "react-redux-firebase";
import { pluginRegistry, PLUGIN_TYPES } from "../../../registry/plugin-registry";

const useDashboard = () => {
  const state = useSelector((state) => state);
  const {
    firestore: {
      status: { requesting },
      data: { stripe }
    },
    firebase: {
      profile: { stripeCustomerId },
    }
  } = state;

  const isLoading = requesting &&
    (Object.keys(requesting).length === 0 || // if we haven't made a request yet
      Object.keys(requesting).filter(value => /^stripe/.test(value)).filter(key => requesting[key] === true).length > 0) // if any 

  const [listeners, setListeners] = useState([])
  const subscriptionStatus = stripe && stripe[stripeCustomerId]?.status
  const isSubscribed = subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.TRIALING ||
    subscriptionStatus === STRIPE_SUBSCRIPTION_STATUS.ACTIVE

  useEffect(() => {
    pluginRegistry.setChangeListener((plugins) => {
      const pluginListeners = plugins.filter(plugin => plugin.type === PLUGIN_TYPES.FIRESTORE_LISTENER)
      setListeners(pluginListeners)
    })
  }, [])

  useFirestoreConnect([...listeners, {
    collection: FIRESTORE_COLLECTIONS.STRIPE,
    doc: stripeCustomerId,
  }])

  return {
    isLoading,
    isSubscribed
  };
};

export default useDashboard;
