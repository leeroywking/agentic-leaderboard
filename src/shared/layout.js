import '../styles.css';
import { renderTopbar, renderFooter } from './nav.js';
import { setPageMeta, getDefaultMeta } from './meta.js';

export function mountPage({
  activePath = '/',
  content,
  title,
  description,
  ogImage,
}) {
  const defaults = getDefaultMeta(activePath);
  setPageMeta({
    title: title ?? defaults.title,
    description: description ?? defaults.description,
    path: activePath,
    ogImage,
  });

  const app = document.querySelector('#app');
  const skip = `<a class="skip-link" href="#top">Skip to content</a>`;
  app.innerHTML = `
    ${skip}
    ${renderTopbar(activePath)}
    <main id="top">
      ${content}
    </main>
    ${renderFooter()}
  `;
}
