import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, AuthIsLoaded } from "./components";
import { SignIn, Verify, Dashboard, LandingPage } from "./pages";
import { StoreProvider } from './store'
import { pluginRegistry, PLUGIN_TYPES } from "./registry/plugin-registry";
import { noApiConfiguration, noStripeConfiguration, noFirebaseConfiguration } from './utils/error-messages'

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

  // VERIFY ENVIRONMENT VARIABLES ARE CORRECTLY SET
  let bowheadConfiguration = pluginRegistry.getPluginsByType(PLUGIN_TYPES.BOWHEAD_CONFIGURATION)[0]?.config

  if (!bowheadConfiguration?.api) {
    console.error(noApiConfiguration)
  }

  if (!bowheadConfiguration?.plans) {
    console.error(noStripeConfiguration)
  }

  const firebaseInstance = bowheadConfiguration?.firebase
  if (!firebaseInstance) {
    console.error(noFirebaseConfiguration)
  }

  // CUSTOM ROUTES CONFIGURATION
  let unAuthenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.UNAUTHENTICATED_ROUTE)
  const authenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.AUTHENTICATED_ROUTE)
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


  return (<>
    {bowheadConfiguration &&
      <ThemeProvider
        {...(theme && { theme })}
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
      </ThemeProvider>
    }
  </>
  );
};

export default Bowhead;
