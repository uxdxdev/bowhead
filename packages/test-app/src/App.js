import React, { useMemo } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
import {
  createFirestoreInstance,
  reduxFirestore,
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  isLoaded,
} from "react-redux-firebase";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// custom
import rootReducer from "./store/rootReducer";
import { firebase } from "./utils/frontend/firebaseFrontend";
import { FIRESTORE_COLLECTIONS } from "./utils/constants";
import { AuthenticatedRoute, PageLoadingSpinner } from "./components";
import { LandingPage, SignIn, Verify, Dashboard, Terms } from "./pages";

const store = configureStore(
  {
    reducer: rootReducer,
    // middleware: [thunk] // default
    enhancers: [
      // enhancements to connect redux to Firebase
      // pass in the firebase config details
      reduxFirestore(firebase, {
        logListenerError: false,
      })]
  },
)

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

const App = () => {
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
                <Route exact path="/" component={LandingPage} />
                <Route path="/terms" component={Terms} />
                <Route path="/signin" component={SignIn} />
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
