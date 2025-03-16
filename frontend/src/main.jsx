import { Provider } from './components/ui/provider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Provider>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
