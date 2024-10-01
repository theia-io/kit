import Quill from 'quill';
import BlockEmbed from 'quill/blots/embed';

class DividerBlot extends BlockEmbed {
  static override blotName = 'divider';
  static override tagName = 'hr';
}

export const registerKitEditorLeafBloatsHandlers = () => {
  Quill.register(DividerBlot);
};
