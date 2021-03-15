import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, AuthIsLoaded } from "./components";
import { SignIn, Verify, Dashboard, LandingPage } from "./pages";
import { StoreProvider } from './store'
import { pluginRegistry, PLUGIN_TYPES } from "./registry/plugin-registry";
import {
  noApiConfiguration,
  noStripeConfiguration,
  noFirebaseInstance,
  noFirestoreInstance,
  noProductionUrl
} from './utils/error-messages'

const getRoutes = ({ routes, isAuthRoute }) => {
  return routes && routes.map((route, index) => {
    const path = route?.path;
    let component = route?.component;

    const isValid = path && component;
    if (!isValid) {
      console.warn('Please provide path and component in routes configuration.')
      return null
    }

    const isLandingPage = path === '/' && !isAuthRoute;
    const updatedPath = isAuthRoute ? `/dashboard${path}` : path;
    const Component = route?.component;

    return (
      <Route
        key={index}
        exact
        path={updatedPath}
        component={isLandingPage ? () => <LandingPage key={index}><Component /></LandingPage> : component} />
    )
  })
}

const Bowhead = () => {

  // VERIFY CONFIGURATION
  let bowheadConfiguration = pluginRegistry.getPluginsByType(PLUGIN_TYPES.CONFIGURATION_BOWHEAD)[0]?.config

  const ConfigurationWalkthrough = () => {
    return (
      <div>
        <h1>Bowhead configuration walkthrough</h1>
        <p>Before you can start using Bowhead you must provide some required configuration information.</p>
        {!bowheadConfiguration?.api && (
          <>
            <h2>Stipe API endpoint configuration</h2>
            <p>Bowhead uses the Stripe API to manage user subscription payments. In order for this feature to work you must deploy the following API endpoints and tell Bowhead where these can be accessed</p>
            <pre>{noApiConfiguration}</pre>
          </>
        )}

        {!bowheadConfiguration?.plans && (
          <>
            <h2>Stipe subscription plans</h2>
            <p>Bowhead uses the Stripe API to manage user subscription payments. You must create subscription plans in the Stripe console and provide the details for each plan to Bowhead.</p>
            <pre>{noStripeConfiguration}</pre>
          </>
        )}

        {!bowheadConfiguration?.firebase && (
          <>
            <h2>Firebase instance</h2>
            <p>Bowhead uses the Google Firebase platform to provide user authentication features. You must create a new project in the Firebase console, initialise an instance of Firebase in this project, and pass this instance to Bowhead.</p>
            <pre>{noFirebaseInstance}</pre>
          </>
        )}

        {!bowheadConfiguration?.firestore && (
          <>
            <h2>Firebase instance</h2>
            <p>Bowhead uses the Google Firestore database to provide user profile management features. You must create a new project in the Firebase console, initialise an instance of Firestore in this project, and pass this instance to Bowhead.</p>
            <pre>{noFirestoreInstance}</pre>
          </>
        )}

        {!bowheadConfiguration?.app && (
          <>
            <h2>Application name and production URL</h2>
            <p>Bowhead provides a user verification feature when signing in. In order for this verification step to work you must provide the deployed production URL of this project to Bowhead. You must also set your project name.</p>
            <pre>{noProductionUrl}</pre>
          </>
        )}
      </div>
    )
  }

  let isConfigurationComplete = true;
  if (!bowheadConfiguration?.api) {
    console.error(noApiConfiguration)
    isConfigurationComplete = false;
  }

  if (!bowheadConfiguration?.plans) {
    console.error(noStripeConfiguration)
    isConfigurationComplete = false;
  }

  const firebaseInstance = bowheadConfiguration?.firebase
  if (!firebaseInstance) {
    console.error(noFirebaseInstance)
    isConfigurationComplete = false;
  }

  const firestoreInstance = bowheadConfiguration?.firestore
  if (!firestoreInstance) {
    console.error(noFirestoreInstance)
    isConfigurationComplete = false;
  }

  if (!bowheadConfiguration?.app?.productionUrl) {
    console.error(noProductionUrl)
    isConfigurationComplete = false;
  }

  // CUSTOM ROUTES CONFIGURATION
  let unAuthenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.ROUTE_UNAUTHENTICATED)
  const authenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.ROUTE_AUTHENTICATED)
  const themes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.THEME)
  const theme = themes.length > 0 && themes[0].theme;

  const DefaultLandingPage = () => <div>Default landing page</div>
  const defaultUnAuthRoutes = [{
    path: '/',
    component: DefaultLandingPage
  }]

  // set default routes
  if (unAuthenticatedRoutes.length <= 0) unAuthenticatedRoutes = defaultUnAuthRoutes

  const DashboardWrapper = (props) => {
    return (
      <Dashboard {...props} >
        {getRoutes({ routes: authenticatedRoutes, isAuthRoute: true })}
      </Dashboard>)
  }

  const defaultTheme = createMuiTheme()

  return (<>
    {bowheadConfiguration && isConfigurationComplete ?
      <ThemeProvider
        theme={theme || defaultTheme}
      >
        <StoreProvider>
          <AuthIsLoaded>
            <CssBaseline />
            <BrowserRouter>
              <Switch>
                {getRoutes({ routes: unAuthenticatedRoutes })}
                <Route path="/signin" component={SignIn} />
                <Route path="/verify" component={Verify} />
                <AuthenticatedRoute path="/dashboard" component={DashboardWrapper} />
                <Route component={() => <div>No page found</div>} />
              </Switch>
            </BrowserRouter>
          </AuthIsLoaded>
        </StoreProvider>
      </ThemeProvider> : <ConfigurationWalkthrough />
    }
  </>
  );
};

export default Bowhead;
