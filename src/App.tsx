import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/login';
import List from './components/list';
import MapPage from './components/map/MapPage';
import Stats from './components/stats';
import Settings from './components/settings';
import Form from './components/form';
import BottomTabs from './components/_common/BottomTabs';
import WriteButton from './components/_common/WriteButton';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <div className="layout">
          <main className="main">
            <Route path="/list">
              <List />
            </Route>
            <Route path="/map">
              <MapPage />
            </Route>
            <Route path="/form">
              <Form />
            </Route>
            <Route path="/stats">
              <Stats />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
          </main>
          <footer className="footer">
            <BottomTabs />
          </footer>
          <WriteButton />
        </div>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
