import React from 'react';
import ReactDOM from 'react-dom';
import { LocationProvider } from '@reach/router';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/ionicons.min.css';
import './assets/scss/style.scss';

ReactDOM.render(
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById('root')
);
