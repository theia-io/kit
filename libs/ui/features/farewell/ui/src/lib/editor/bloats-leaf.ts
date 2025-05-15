import Quill from 'quill';
import BlockEmbed from 'quill/blots/embed';

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
  dataId?: string;
  alt: string;
  // ngSrc: string | any; // Angular ngSrc. Note! that `NgOptimizedImage` has to be imported
  src: string | any;
  width?: number;
  height?: number;
  loadedCb: () => void;
}

class ImageBlot extends BlockEmbed {
  static override blotName = 'image';
  static override tagName = 'img';

  static override create({ alt, src, dataId, loadedCb }: ImageConfiguration) {
    const node = super.create() as HTMLImageElement;

    node.setAttribute('contenteditable', 'false');
    node.setAttribute('alt', alt);
    node.setAttribute('src', src);
    if (dataId) {
      node.setAttribute('data-id', dataId);
    }

    node.addEventListener('load', () => {
      if (loadedCb) loadedCb();
    });

    // node.setAttribute('width', `${width}`);
    // node.setAttribute('height', `${height}`);

    return node;
  }

  static override value(
    node: HTMLImageElement,
  ): Omit<ImageConfiguration, 'loadedCb'> {
    return {
      alt: node.getAttribute('alt') ?? '',
      src: node.getAttribute('src') ?? '',
      height: Number(node.getAttribute('height') ?? '150'),
      width: Number(node.getAttribute('width') ?? '150'),
    };
  }
}

export const registerKitEditorLeafBloatsHandlers = () => {
  Quill.register(DividerBlot);
  // Quill.register(DividerTestBlot);
  Quill.register(ImageBlot);
};
