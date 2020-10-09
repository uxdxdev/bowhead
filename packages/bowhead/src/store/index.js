import React from 'react'
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
    reduxFirestore,
    createFirestoreInstance,
    constants as rfConstants
} from "redux-firestore";
import { FIRESTORE_COLLECTIONS } from "../utils/constants";
import { Provider } from "react-redux";
import {
    ReactReduxFirebaseProvider,
    actionTypes as rrfActionTypes
} from "react-redux-firebase";
import { pluginRegistry, PLUGIN_TYPES } from '../registry/plugin-registry'
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import bowheadSlice from '../store/bowheadSlice'

const getStore = (firebase) => {

    // see: https://redux-toolkit.js.org/usage/usage-guide#use-with-react-redux-firebase
    const middleware = [
        ...getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    // just ignore every redux-firebase and react-redux-firebase action type
                    ...Object.keys(rfConstants.actionTypes).map(
                        type => `${rfConstants.actionsPrefix}/${type}`
                    ),
                    ...Object.keys(rrfActionTypes).map(
                        type => `@@reactReduxFirebase/${type}`
                    ),
                    'bowhead/deleteUserError'
                ],
                ignoredPaths: ['firebase', 'firestore']
            }
        })
    ]

    const getReducers = (plugins) => {
        const reducers = {}
        plugins.forEach(plugin => {
            reducers[plugin.name] = plugin.reducer
        })

        // bowhead redux slices
        reducers.bowhead = bowheadSlice
        reducers.firestore = firestoreReducer
        reducers.firebase = firebaseReducer

        return reducers
    }

    const reducerPlugins = pluginRegistry.getPluginsByType(PLUGIN_TYPES.REDUCER)
    const reducers = getReducers(reducerPlugins);

    // see: https://github.com/reduxjs/redux-toolkit
    const store = configureStore(
        {
            reducer: combineReducers(reducers),
            middleware,
            enhancers: [
                // enhancements to connect redux to Firebase
                // pass in the firebase config details
                reduxFirestore(firebase, {
                    logListenerError: false,
                })]
        },
    )

    pluginRegistry.setChangeListener(plugins => {
        const reducers = getReducers(plugins.filter(plugin => plugin.type === PLUGIN_TYPES.REDUCER));
        store.replaceReducer(combineReducers(reducers));
    });

    return store;
}

const StoreProvider = ({ children }) => {

    const firebase = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config?.firebase

    const store = getStore(firebase)

    // see: https://github.com/prescottprue/react-redux-firebase
    const reactReduxFirebaseConfig = {
        firebase, // authentication data
        createFirestoreInstance, // firestore data
        config: {
            userProfile: FIRESTORE_COLLECTIONS.USERS,
            useFirestoreForProfile: true,
        },
        dispatch: store.dispatch,
    };

    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...reactReduxFirebaseConfig}>
                {children}
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

export { StoreProvider };