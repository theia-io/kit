import Quill from 'quill';
import Block from 'quill/blots/block';
import Inline from 'quill/blots/inline';

class BoldBlot extends Inline {
  static override blotName = 'bold';
  static override tagName = 'strong';
}

class ItalicBlot extends Inline {
  static override blotName = 'italic';
  static override tagName = 'em';
}

class LinkBlot extends Inline {
  static override blotName = 'link';
  static override tagName = 'a';

  static override create(value: string) {
    const node = super.create();
    // Sanitize url value if desired
    node.setAttribute('href', value);
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('target', '_blank');

    return node;
  }

  static override formats(node: HTMLLinkElement) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute('href');
  }
}

class BlockquoteBlot extends Block {
  static override blotName = 'blockquote';
  static override tagName = 'blockquote';
}

class HeaderBlot extends Block {
  static override blotName = 'header';
  static override tagName = ['H1', 'H2'];

  static override formats(node: HTMLHeadElement) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1;
  }
}

export const registerKitEditorHandlers = () => {
  Quill.register(BoldBlot);
  Quill.register(ItalicBlot);
  Quill.register(LinkBlot);
  Quill.register(BlockquoteBlot);
  Quill.register(HeaderBlot);
};
