import React from 'react'
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
    reduxFirestore,
    createFirestoreInstance,
    constants as rfConstants
} from "redux-firestore";
import { firebase } from "../utils/firebaseFrontend";
import * as constants from "../utils/constants";
import { Provider } from "react-redux";
import {
    ReactReduxFirebaseProvider,
    actionTypes as rrfActionTypes
} from "react-redux-firebase";
import { pluginRegistry } from '../registry/plugin-registry'
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import { PLUGIN_TYPES } from '../utils/pluginTypes';

const getStore = () => {

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
                    'user/deleteUserError'
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
    const store = getStore()

    // see: https://github.com/prescottprue/react-redux-firebase
    const reactReduxFirebaseConfig = {
        firebase, // authentication data
        createFirestoreInstance, // firestore data
        config: {
            userProfile: constants.FIRESTORE_COLLECTIONS.USERS,
            useFirestoreForProfile: true,
        },
        dispatch: store.dispatch,
    };

    pluginRegistry.register('firestore-reducer', {
        type: PLUGIN_TYPES.REDUCER,
        name: 'firestore',
        reducer: firestoreReducer
    })

    pluginRegistry.register('firebase-reducer', {
        type: PLUGIN_TYPES.REDUCER,
        name: 'firebase',
        reducer: firebaseReducer
    })

    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...reactReduxFirebaseConfig}>
                {children}
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

export { StoreProvider };