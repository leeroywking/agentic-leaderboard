import '../styles.css';
import { renderTopbar, renderFooter } from './nav.js';

export function mountPage({ activePath = '/', content }) {
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
