import React from 'react'
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
    reduxFirestore,
    createFirestoreInstance,
    constants as rfConstants
} from "redux-firestore";
import rootReducer from "./rootReducer";
import { firebase } from "../utils/firebaseFrontend";
import * as constants from "../utils/constants";
import { Provider } from "react-redux";
import {
    ReactReduxFirebaseProvider,
    actionTypes as rrfActionTypes
} from "react-redux-firebase";

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
        reducer: rootReducer,
        middleware,
        enhancers: [
            // enhancements to connect redux to Firebase
            // pass in the firebase config details
            reduxFirestore(firebase, {
                logListenerError: false,
            })]
    },
)

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

const StoreProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...reactReduxFirebaseConfig}>
                {children}
            </ReactReduxFirebaseProvider>
        </Provider>
    )
}

export { StoreProvider };