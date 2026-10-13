import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { StoreProvider } from './Store.jsx';
import './index.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><StoreProvider><App /></StoreProvider></BrowserRouter>);
