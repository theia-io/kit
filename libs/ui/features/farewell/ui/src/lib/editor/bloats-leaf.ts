import Quill from 'quill';
import BlockEmbed from 'quill/blots/embed';

function onElementRemoved(element: any, callback: any) {
  const observer = new MutationObserver(function (mutations) {
    if (!document.body.contains(element)) {
      callback();
      observer.disconnect();
    }
  });

  observer.observe(element);
}

// class DividerTestBlot extends BlockEmbed {
//   static override blotName = 'non-editable-paragraph';
//   static override tagName = 'p';

//   static override create(html: string) {
//     const node = super.create() as HTMLParagraphElement;
//     node.setAttribute('contenteditable', 'false');
//     node.innerHTML = html;

//     return node;
//   }
// }

class DividerBlot extends BlockEmbed {
  static override blotName = 'divider';
  static override tagName = 'hr';

  static override create() {
    const node = super.create() as HTMLParagraphElement;
    node.setAttribute('contenteditable', 'false');

    return node;
  }
}

export interface ImageConfiguration {
  alt: string;
  // ngSrc: string | any; // Angular ngSrc. Note! that `NgOptimizedImage` has to be imported
  src: string | any;
  width: number;
  height: number;
}

class ImageBlot extends BlockEmbed {
  static override blotName = 'image';
  static override tagName = 'img';

  static override create({ alt, src }: ImageConfiguration) {
    const node = super.create() as HTMLImageElement;

    node.setAttribute('alt', alt);
    node.setAttribute('src', src);
    // node.setAttribute('width', `${width}`);
    // node.setAttribute('height', `${height}`);

    return node;
  }

  static override value(node: HTMLImageElement): ImageConfiguration {
    return {
      alt: node.getAttribute('alt') ?? '',
      src: node.getAttribute('src') ?? '',
      height: Number(node.getAttribute('height') ?? '150'),
      width: Number(node.getAttribute('width') ?? 150),
    };
  }
}

export const registerKitEditorLeafBloatsHandlers = () => {
  Quill.register(DividerBlot);
  // Quill.register(DividerTestBlot);
  Quill.register(ImageBlot);
};
