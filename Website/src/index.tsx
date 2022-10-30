import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AnimatedRoutes } from './Components';

import './reset.scss'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatedRoutes/>
    </BrowserRouter>
  </React.StrictMode>
);
