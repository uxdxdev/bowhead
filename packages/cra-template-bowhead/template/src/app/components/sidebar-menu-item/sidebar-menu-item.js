import React from "react";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@material-ui/core";
import {
  ExpandMore as IconExpandMore,
  ExpandLess as IconExpandLess,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  listItem: {
    color: theme.palette.text.primary,
  },
  listItemText: {
    fontWeight: theme.typography.h6.fontWeight,
  },
  listItemIcon: {
    minWidth: theme.spacing(4),
  },
}));

const SidebarMenuItem = (props) => {
  const { text, link, Icon, items = [], Component, onClick, style, isDefaultOpen } = props;
  const classes = useStyles();
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = React.useState(isDefaultOpen);

  function handleClick() {
    // call onClick if in plugin
    onClick && onClick();

    isExpandable && setOpen(!open);
  }

  const MenuItemRoot = (
    <ListItem
      key={link}
      button
      component={link ? NavLink : null}
      to={link ? link : null}
      className={classes.listItem}
      style={style}
      underline="none"
      onClick={handleClick}
    >
      <ListItemIcon className={classes.listItemIcon}>
        {Icon ? <Icon /> : <></>}
      </ListItemIcon>
      <ListItemText className={classes.listItemText}>{text}</ListItemText>
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
    </ListItem>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <SidebarMenuItem {...item} key={index} />
        ))}
      </List>
    </Collapse>
  ) : null;

  return Component ? (
    <Component />
  ) : (
      <>
        {MenuItemRoot}
        {MenuItemChildren}
      </>
    );
};

export default SidebarMenuItem;
