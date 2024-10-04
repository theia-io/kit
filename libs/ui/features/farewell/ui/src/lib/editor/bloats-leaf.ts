import Quill from 'quill';
import BlockEmbed from 'quill/blots/embed';

class DividerBlot extends BlockEmbed {
  static override blotName = 'divider';
  static override tagName = 'hr';
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

  static override create({ alt, src, height, width }: ImageConfiguration) {
    const node = super.create() as HTMLImageElement;

    node.setAttribute('alt', alt);
    node.setAttribute('src', src);
    // node.setAttribute('width', `${width}`);
    // node.setAttribute('height', `${height}`);

    return node;
  }

  static override value(node: HTMLImageElement) {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src'),
    };
  }
}

export const registerKitEditorLeafBloatsHandlers = () => {
  Quill.register(DividerBlot);
  Quill.register(ImageBlot);
};
