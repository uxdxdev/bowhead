import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Hidden, Drawer } from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
} from "@material-ui/icons";
import { SidebarMenuItem } from "../sidebar-menu-item";
import { pluginRegistry, PLUGIN_TYPES } from '../../registry/plugin-registry'

// sidebar
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.background.default,
    '& .MuiCollapse-entered': {
      overflow: 'auto'
    },
  }
}));

const DashboardNavSidebar = ({
  handleDrawerToggle,
  mobileOpen
}) => {
  const classes = useStyles();

  // currently selected menu item 
  const [activeMenuItem, setActiveMenuItem] = useState('')

  const sidebarMenuItems = pluginRegistry.getPluginsByType(PLUGIN_TYPES.LINK_SIDEBAR)

  sidebarMenuItems.unshift({
    type: PLUGIN_TYPES.LINK_SIDEBAR,
    menuIcon: DashboardIcon,
    text: "Dashboard",
    path: "/",
  })

  const drawer = () => {
    return sidebarMenuItems.map(
      (menuItem, index) =>
        menuItem && <SidebarMenuItem
          key={index}
          {...menuItem}
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          handleDrawerToggle={handleDrawerToggle}
        />
    );
  };

  return (
    <>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer()}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          <div className={classes.toolbar} />
          {drawer()}
        </Drawer>
      </Hidden>
    </>
  );
};


export default DashboardNavSidebar;
