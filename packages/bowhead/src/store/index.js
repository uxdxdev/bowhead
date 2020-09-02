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
import { reducerRegistry } from '../registry/reducer-registry'
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

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

    // see: https://github.com/reduxjs/redux-toolkit
    const store = configureStore(
        {
            reducer: combineReducers(reducerRegistry.getReducers()),
            middleware,
            enhancers: [
                // enhancements to connect redux to Firebase
                // pass in the firebase config details
                reduxFirestore(firebase, {
                    logListenerError: false,
                })]
        },
    )

    reducerRegistry.setChangeListener(reducers => {
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

    reducerRegistry.register('firestore', firestoreReducer)
    reducerRegistry.register('firebase', firebaseReducer)

    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...reactReduxFirebaseConfig}>
                {children}
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

export { StoreProvider };