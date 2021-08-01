import React from 'react';
import { IconButton, InputBase, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';

function SearchBar() {
  return (
    <Paper component="form" className="root">
      {/*<IconButton className={classes.iconButton} aria-label="menu">*/}
      {/*  <MenuIcon />*/}
      {/*</IconButton>*/}
      <InputBase className="input" placeholder="장소 검색" inputProps={{ 'aria-label': '장소 검색' }} />
      <IconButton type="submit" className="iconButton" aria-label="search">
        <Search />
      </IconButton>
      {/*<Divider className={classes.divider} orientation="vertical" />*/}
      {/*<IconButton color="primary" className={classes.iconButton} aria-label="directions">*/}
      {/*  <DirectionsIcon />*/}
      {/*</IconButton>*/}
    </Paper>
  );
}

export default SearchBar;
