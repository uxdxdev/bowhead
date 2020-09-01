import React, { useMemo } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { AuthenticatedRoute, AuthIsLoaded } from "./components";
import { SignIn, Verify, Dashboard, LandingPage } from "./pages";
import { StoreProvider } from './store'
import { PLUGIN_TYPES } from './utils/pluginTypes'

const getRoutes = ({ routes, isDashboardRoute }) => {
  return routes && routes.map((route, index) => {
    const path = route?.path;
    let component = route?.component;

    const isValid = path && component;
    if (!isValid) {
      console.warn('Please provide path and component in routes configuration.')
      return null
    }

    const isLandingPage = path === '/' && !isDashboardRoute;
    const updatedPath = isDashboardRoute ? `/dashboard${path}` : path;
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

const Bowhead = ({ theme, config }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const DefaultLandingPage = () => <div>Default landing page</div>;
  const defaultPlugins = [
    {
      type: PLUGIN_TYPES.ROUTE.ROOT,
      path: '/',
      component: DefaultLandingPage,
    }
  ]

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

  const plugins = config || defaultPlugins;

  const unAuthRoutes = plugins?.filter(plugin => plugin?.type === PLUGIN_TYPES.ROUTE.ROOT)
  const dashboardRoutes = plugins?.filter(plugin => plugin?.type === PLUGIN_TYPES.ROUTE.DASHBOARD)
  const popoverMenuItems = plugins?.filter(plugin => plugin?.type === PLUGIN_TYPES.MENU_ITEM.POP_OVER)
  const sidebarMenuItems = plugins?.filter(plugin => plugin?.type === PLUGIN_TYPES.MENU_ITEM.SIDEBAR)
  const reducers = plugins?.filter(plugin => plugin?.type === PLUGIN_TYPES.REDUCER)
    .reduce((obj, item) => (obj[item.name] = item.reducer, obj), {});

  const AuthedDashboard = (props) => {
    return (
      <Dashboard
        {...props}
        popoverMenuItems={popoverMenuItems}
        sidebarMenuItems={sidebarMenuItems}
      >
        {getRoutes({ routes: dashboardRoutes, isDashboardRoute: true })}
      </Dashboard>)
  }


  return (
    <ThemeProvider theme={theme || defaultTheme}>
      <StoreProvider reducers={reducers}>
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
