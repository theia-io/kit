import { inject } from '@angular/core';
import { ENVIRONMENT } from '../environments';

export class OnDemandPreloading {
  #jsLoaded = false;
  #cssLoaded = false;

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

const jsLoadedMapAsync = new Map<string, Promise<boolean> | undefined>();
export function onDemandJS(script: { name: string; path: string }) {
  const environment = inject(ENVIRONMENT);
  const { name, path } = script;

  console.log(name, path, 'onDemandJS');

  return () => {
    const promise = new Promise((res) => {
      const isJsLoadedFound = jsLoadedMapAsync.get(name);

      if (isJsLoadedFound !== undefined) {
        //
      } else {
        const scripts = document.getElementsByTagName('script');

        let isDOMFound = false;

        let domSrcIdx = 0;
        while (domSrcIdx <= scripts.length && !isDOMFound) {
          if (!environment.production) {
            console.info(
              'scripts[' + domSrcIdx + "].getAttribute('src')",
              scripts[domSrcIdx].getAttribute('src')
            );
          }

          if (scripts[domSrcIdx].getAttribute('src')?.includes(name)) {
            isDOMFound = true;
          }

          domSrcIdx++;
        }

        //   for (let i = 0; i < scripts.length; ++i) {
        //     console.log(
        //       'scripts[' + i + "].getAttribute('src')",
        //       scripts[i].getAttribute('src')
        //     );

        //     if (scripts[i].getAttribute('src')?.includes('intro')) {
        //       isDOMFound = true;
        //     }
        //   }

        const resultCb = () => res(true);

        if (!isDOMFound) {
          const script = document.createElement('script');
          script.onload = () => {
            if (!environment.production) {
              console.log(path, name, 'LOADED');
            }

            resultCb();
          };

          console.log(path, name, 'LOADING STARTED');

          // Note! this has to be build and added to final build (but not referenced in index.html) on demand loading to save resources.

          // Potentially we can explore loading it using idleFeedback timeout to save even in all future operations when such "on demand" scripts will be loaded ahead of time and offered
          script.src = path;
          script.type = 'text/javascript';
          script.async = false;

          document.getElementsByTagName('head')[0].appendChild(script);
        } else if (!environment.production) {
          console.error('This file was already loaded.');
        }
      }
    });

    return promise;
  };
}

const cssLoadedMapAsync = new Map<string, Promise<boolean> | undefined>();
export function onDemandCSS(css: { name: string; path: string }, ...rest: any) {
  // const environment = inject(ENVIRONMENT);
  const { name, path } = css;

  console.log(name, path, 'onDemandCSS STATIC', ...rest);

  return <T>(
    target: T,
    propertyName: keyof T,
    descriptor: PropertyDescriptor
  ) => {
    console.log('onDemandCSS EXECUTION', target, propertyName);

    // Store Original Method Impleentation
    const originalMethod = descriptor.value;

    const promise = new Promise((res) => {
      let isDomFound = false;

      const styles = document.getElementsByTagName('link');
      let stylesIdx = 0;
      while (stylesIdx < styles.length && !isDomFound) {
        if (styles[stylesIdx].getAttribute('href')?.includes(name)) {
          isDomFound = true;
        }

        stylesIdx++;
      }

      if (!isDomFound) {
        const style = document.createElement('link');
        style.onload = () => {
          console.log('CSS LOADING LOADED', name, path);
          res(true);
        };

        console.log('CSS LOADING STARTED', name, path);

        style.id = name;
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = path;

        document.getElementsByTagName('head')[0].appendChild(style);
      }
    });

    descriptor.value = async function (...args: any[]) {
      console.log('targetFnOriginal', originalMethod);
      await Promise.resolve(promise);

      const result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
