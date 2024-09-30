import Quill from 'quill';
import Inline from 'quill/blots/inline';

class BoldBlot extends Inline {
  static override blotName = 'bolda';
  static override tagName = 'strong';
}

class ItalicBlot extends Inline {
  static override blotName = 'italica';
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

export const registerKitEditorHandlers = () => {
  Quill.register(BoldBlot);
  Quill.register(ItalicBlot);
  Quill.register(LinkBlot);
};
