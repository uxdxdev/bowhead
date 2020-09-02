import React, { useMemo } from "react";
import { Bowhead, PLUGIN_TYPES, pluginRegistry } from "@mortond/bowhead";
import { LandingPage, Terms } from './pages'
import { Projects, ProjectDetails, Settings, Dashboard } from './components'
import projectSlice from "./store/projectSlice";
import {
  Settings as SettingsIcon,
  List as ListIcon,
} from "@material-ui/icons";
import { createMuiTheme } from "@material-ui/core/styles";

const App = () => {

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
          type: "dark",
          primary: { main: "#00B0FF" },
          secondary: { main: "#F50057" },
        },
      }),
    []
  );

  const plugins = [
    {
      type: PLUGIN_TYPES.THEME,
      theme: theme
    },
    {
      type: PLUGIN_TYPES.UNAUTHENTICATED_ROUTE,
      path: '/',
      component: LandingPage,
    },
    {
      type: PLUGIN_TYPES.UNAUTHENTICATED_ROUTE,
      path: '/terms',
      component: Terms,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      path: '/',
      component: Dashboard,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      path: '/project',
      component: Projects,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      path: '/project/:id',
      component: ProjectDetails,
    },
    {
      type: PLUGIN_TYPES.AUTHENTICATED_ROUTE,
      path: '/settings',
      component: Settings,
    },
    {
      type: PLUGIN_TYPES.MENU_ITEM.POP_OVER,
      path: "/settings",
      menuIcon: SettingsIcon,
      text: 'Settings'
    },
    {
      type: PLUGIN_TYPES.MENU_ITEM.SIDEBAR,
      menuIcon: ListIcon,
      text: "Projects",
      path: "/dashboard/project",
    },
    {
      type: PLUGIN_TYPES.REDUCER,
      name: 'project',
      reducer: projectSlice
    }
  ]

  plugins.forEach(plugin => {
    pluginRegistry.register(plugin)
  })

  return (
    <Bowhead />
  );
};

export default App;
