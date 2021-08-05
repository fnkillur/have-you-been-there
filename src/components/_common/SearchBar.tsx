import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { IconButton, InputBase, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import './SearchBar.scss';

function SearchBar() {
  const location = useLocation();
  const history = useHistory();
  const search = decodeURIComponent(location.search.substring(1).split('=')[1] || '');

  const formik = useFormik({
    initialValues: { search },
    onSubmit(values) {
      history.push(`${location.pathname}?search=${values.search}`);
    },
  });

  return (
    <Paper component="form" className="root">
      <InputBase
        className="input"
        placeholder="장소 검색"
        inputProps={{ 'aria-label': '장소 검색' }}
        name="search"
        value={formik.values.search}
        onChange={formik.handleChange}
        onKeyDown={({ key }) => {
          if (key === 'Enter' && formik.values.search) {
            formik.submitForm();
          }
        }}
      />
      <IconButton
        type="submit"
        className="iconButton"
        aria-label="search"
        onClick={() => formik.submitForm()}
        disabled={!formik.values.search}
      >
        <Search />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
