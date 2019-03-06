import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Main from './components/pages/Main';
import About from './components/pages/About';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <AppNavbar />
          <Route exact path="/" component={Main} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    );
  }
}

export default App;
