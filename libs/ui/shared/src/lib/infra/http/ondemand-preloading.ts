export function onDemandCSS(css: { name: string; path: string }) {
  const { name, path } = css;
  console.log('onDemandCSS STATIC', name, path);

  return <T>(
    target: T,
    propertyName: keyof T,
    descriptor: PropertyDescriptor
  ) => {
    console.log('onDemandCSS', name, path, target, propertyName);
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
          res(true);
        };

        style.id = name;
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = path;

        document.getElementsByTagName('head')[0].appendChild(style);
      }
    });

    descriptor.value = async function (...args: any[]) {
      await Promise.resolve(promise);

      const result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
