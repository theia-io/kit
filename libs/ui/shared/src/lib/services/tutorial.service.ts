import { Injectable } from '@angular/core';
import introJs from 'intro.js'; // Import introJs
import { IntroJs } from 'intro.js/src/intro';

const LS_TRUE = 'true';
const ABOUT_YOURSELF_PAGE_KEY = 'Tutorial:ABOUT_YOURSELF_PAGE_KEY';

/** This service will be:
 * 1. Initializing Tutorial library solution on demand (and hide its implementation so refactoring in the future
 * is limited to updating what's used by it),
 *
 */
@Injectable({ providedIn: 'root' })
export class TutorialService {
  #jsLoaded = false;
  #cssLoaded = false;

  #introJs: IntroJs | null = null;

  async showAboutUsPageTourIfNotShown() {
    if (localStorage.getItem(ABOUT_YOURSELF_PAGE_KEY) === LS_TRUE) {
      return;
    }

    await this.#init();

    this.#introJs = introJs();
    this.#introJs
      .setOptions({
        showProgress: true,
        steps: [
          {
            intro:
              'Welcome. We request some of your personal information to get to know you better. You can skip (scroll) this section if you want to.',
          },
        ],
      })
      .start();

    localStorage.setItem(ABOUT_YOURSELF_PAGE_KEY, LS_TRUE);
  }

  #init() {
    /** This is not perfect as it would be cached between versioning & updates of intro JS and CSS files
     * @TODO Invalidate intro cache between intojs upgrades
     */

    const loadJSPromise = this.#jsLoaded
      ? Promise.resolve(true)
      : this.#loadJS();

    const loadCSSPromise = this.#cssLoaded
      ? Promise.resolve(true)
      : this.#loadCSS();

    return Promise.all([loadJSPromise, loadCSSPromise]);
  }

  #loadJS() {
    return new Promise((res) => {
      let isFound = false;
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; ++i) {
        // console.log(
        //   "scripts[i].getAttribute('src')",
        //   scripts[i].getAttribute('src')
        // );
        if (scripts[i].getAttribute('src')?.includes('intro')) {
          isFound = true;
        }
      }

      if (!isFound) {
        const script = document.createElement('script');
        script.onload = () => {
          //   console.log('JS LOADED');
          res(true);
        };

        // console.log('JS LOADING STARTED');
        script.src = '/intro.js';
        script.type = 'text/javascript';
        script.async = false;

        document.getElementsByTagName('head')[0].appendChild(script);

        this.#jsLoaded = true;
      }
    });
  }

  #loadCSS() {
    return new Promise((res) => {
      let isFound = false;
      const styles = document.getElementsByTagName('link');
      for (let i = 0; i < styles.length; ++i) {
        if (styles[i].getAttribute('href')?.includes('intro')) {
          isFound = true;
        }
      }

      if (!isFound) {
        const style = document.createElement('link');
        style.onload = () => {
          res(true);
        };

        // console.log('CSS LOADING STARTED');

        style.id = 'client-theme';
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = '/introjs.css';

        document.getElementsByTagName('head')[0].appendChild(style);
        this.#cssLoaded = true;
      }
    });
  }
}
