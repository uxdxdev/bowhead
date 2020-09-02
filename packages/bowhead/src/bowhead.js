import React, { useMemo } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, AuthIsLoaded } from "./components";
import { SignIn, Verify, Dashboard, LandingPage } from "./pages";
import { StoreProvider } from './store'
import { PLUGIN_TYPES } from './utils/pluginTypes'
import { pluginRegistry } from "./registry/plugin-registry";

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
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const defaultTheme = useMemo(
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

  const unAuthRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.UNAUTHENTICATED_ROUTE)
  const authenticatedRoutes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.AUTHENTICATED_ROUTE)
  const popoverMenuItems = pluginRegistry.getPluginsByType(PLUGIN_TYPES.MENU_ITEM.POP_OVER)
  const sidebarMenuItems = pluginRegistry.getPluginsByType(PLUGIN_TYPES.MENU_ITEM.SIDEBAR)
  const themes = pluginRegistry.getPluginsByType(PLUGIN_TYPES.THEME)
  const theme = themes.length > 0 && themes[0].theme;

  const AuthedDashboard = (props) => {
    return (
      <Dashboard
        {...props}
        popoverMenuItems={popoverMenuItems}
        sidebarMenuItems={sidebarMenuItems}
      >
        {getRoutes({ routes: authenticatedRoutes, isAuthRoute: true })}
      </Dashboard>)
  }


  return (
    <ThemeProvider theme={theme || defaultTheme}>
      <StoreProvider>
        <AuthIsLoaded>
          <CssBaseline />
          <BrowserRouter>
            <Switch>
              {getRoutes({ routes: unAuthRoutes })}
              <Route path="/signin" component={SignIn} />
              <Route path="/verify" component={Verify} />
              <AuthenticatedRoute path="/dashboard" component={AuthedDashboard} />
            </Switch>
          </BrowserRouter>
        </AuthIsLoaded>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default Bowhead;
