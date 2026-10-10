import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/foundation.css';

const node = document.getElementById('root');
if (!node) throw new Error('Root element missing');
createRoot(node).render(<StrictMode><App /></StrictMode>);
