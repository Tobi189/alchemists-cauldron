export const renderApp = (container: HTMLElement): void => {
  const main = document.createElement('main');
  const title = document.createElement('h1');
  const description = document.createElement('p');

  main.className = 'app';
  title.className = 'app__title';
  description.className = 'app__description';

  title.textContent = "Alchemist's Cauldron";
  description.textContent = 'Project setup in progress';

  main.append(title, description);
  container.replaceChildren(main);
};