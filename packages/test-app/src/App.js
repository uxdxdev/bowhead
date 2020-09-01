import React from "react";
import { Bowhead, PLUGIN_TYPES } from "@mortond/bowhead";
import { LandingPage, Terms } from './pages'
import { Projects, ProjectDetails, Settings, Dashboard } from './components'
import projectSlice from "./store/projectSlice";
import {
  Settings as SettingsIcon,
  List as ListIcon,
} from "@material-ui/icons";

const App = () => {

  const plugins = [
    {
      type: PLUGIN_TYPES.ROUTE.ROOT,
      path: '/',
      component: LandingPage,
    },
    {
      type: PLUGIN_TYPES.ROUTE.ROOT,
      path: '/terms',
      component: Terms,
    },
    {
      type: PLUGIN_TYPES.ROUTE.DASHBOARD,
      path: '/',
      component: Dashboard,
    },
    {
      type: PLUGIN_TYPES.ROUTE.DASHBOARD,
      path: '/project',
      component: Projects,
    },
    {
      type: PLUGIN_TYPES.ROUTE.DASHBOARD,
      path: '/project/:id',
      component: ProjectDetails,
    },
    {
      type: PLUGIN_TYPES.ROUTE.DASHBOARD,
      path: '/settings',
      component: Settings,
    }, {
      type: PLUGIN_TYPES.REDUCER,
      name: 'project',
      reducer: projectSlice
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
    }
  ]

  return (
    <Bowhead
      config={plugins}
    />
  );
};

export default App;
