import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./components/login";
import List from "./components/list";
import Map from "./components/map";
import Form from "./components/form";
import Stats from "./components/stats";
import Settings from "./components/settings";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <Login/>
        </Route>
        <Route path="/list">
          <List/>
        </Route>
        <Route path="/map">
          <Map/>
        </Route>
        <Route path="/form">
          <Form/>
        </Route>
        <Route path="/stats">
          <Stats/>
        </Route>
        <Route path="/settings">
          <Settings/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
