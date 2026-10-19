import './styles/main.scss';
import { renderApp } from './ui/app.ts';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root element was not found');
}

renderApp(app);