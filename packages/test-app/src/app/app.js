import React, { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./store/rootReducer";
import { Provider, useSelector } from "react-redux";
import thunk from "redux-thunk";
import {
  createFirestoreInstance,
  reduxFirestore,
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  isLoaded,
} from "react-redux-firebase";
import { firebase } from "../utils/frontend/firebaseFrontend";
import { composeWithDevTools } from "redux-devtools-extension";

// theme
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";
import { FIRESTORE_COLLECTIONS } from "../utils/constants";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, Signin, Verify, Dashboard, PageLoadingSpinner } from "./components";

const store = createStore(
  rootReducer,
  // composeWithDevTools() is used to combine store enhancements similar to how reducers
  // are combined. This version of compose allows the redux store to be viewed in dev tools.
  composeWithDevTools(
    applyMiddleware(thunk),
    // enhancements to connect redux to Firebase
    // pass in the firebase config details
    reduxFirestore(firebase, {
      logListenerError: false,
    })
  )
);

const reactReduxFirebaseConfig = {
  firebase,
  // required to use firestore listeners in react-redux-firebase
  createFirestoreInstance,
  // sync the user data stored in firestore
  // with the firebase redux state
  // this avoids having to deconstruct the snapshot map
  // of the user data stored in firestore
  config: {
    userProfile: FIRESTORE_COLLECTIONS.USERS,
    useFirestoreForProfile: true,
  },
  dispatch: store.dispatch,
};

// do not render the app until Firebase auth is ready
// http://react-redux-firebase.com/docs/recipes/auth.html#wait-for-auth-to-load
const AuthIsLoaded = ({ children }) => {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) return <PageLoadingSpinner />;
  return children;
};

const App = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createMuiTheme({
        typography: {
          fontFamily: ["Inter", "-apple-system"].join(","),
          h1: {
            fontWeight: 700,
            fontSize: "64px",
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: "32px",
          },
          h2: {
            fontWeight: 600,
            fontSize: "40px",
          },
          subtitle2: {
            fontWeight: 400,
            fontSize: "24px",
          },
          h3: {
            fontWeight: 600,
            fontSize: "32px",
          },
          h4: {
            fontWeight: 600,
            fontSize: "28px",
          },
          h5: {
            fontWeight: 600,
            fontSize: "24px",
          },
          h6: {
            fontWeight: 600,
            fontSize: "20px",
          },
          body1: {
            fontWeight: 400,
            fontSize: "14px",
          },
          body2: {
            fontWeight: 400,
            fontSize: "18px",
          },
        },
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: { main: "#00B0FF" },
          secondary: { main: "#F50057" },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ReactReduxFirebaseProvider {...reactReduxFirebaseConfig}>
          <AuthIsLoaded>
            <CssBaseline />
            <BrowserRouter>
              <Switch>
                {children}
                <Route path="/signin" component={Signin} />
                <Route path="/verify" component={Verify} />
                <AuthenticatedRoute path="/dashboard" component={Dashboard} />
              </Switch>
            </BrowserRouter>
          </AuthIsLoaded>
        </ReactReduxFirebaseProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
