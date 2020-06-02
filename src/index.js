import React from 'react';
import ReactDOM from 'react-dom';
import { LocationProvider } from '@reach/router';
import App from './App';
import 'slick-carousel/slick/slick.css';
  <LocationProvider>
    <App />
  </LocationProvider>,
  document.getElementById('root')
);
