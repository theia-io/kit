export function onElementRemoved(element: any, callback: any) {
  const observer = new MutationObserver(function (mutations) {
    if (!document.body.contains(element)) {
      callback();
      observer.disconnect();
    }
  });

  observer.observe(element);
}
