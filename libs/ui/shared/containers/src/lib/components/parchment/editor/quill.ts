/**
 * 
Line merging when using backspace. This behavior, while sometimes unexpected, is often related to how Quill manages its internal document structure and optimizes for performance.

Here's a breakdown of what's likely happening:

Line Representation: Quill represents each line in the editor as a separate block-level element (usually a <p> tag).  These blocks are managed as nodes in Parchment's internal tree structure.

Backspace Action: When you press backspace at the beginning of a line to merge it with the previous line, Quill doesn't simply move the text content. Instead, it performs a more complex operation:

It deletes the current line's block element.
It inserts the content of the deleted line into the previous line's block element.
Optimization: This removal and re-insertion might seem inefficient, but it can be beneficial for Quill's internal operations:

Maintaining Structure: It helps maintain the consistent block-level structure of the document, which is crucial for formatting and other features.
Performance: In some cases, re-inserting the content can be faster than manipulating individual characters or text nodes within the DOM.
Undo/Redo: This approach can simplify the implementation of undo/redo functionality, as it treats the merge as a single operation.
Observable Effect: The consequence of this behavior is that the previous line appears to be briefly removed and then re-inserted, even though the visual result is just the merging of the two lines.

Why this might be noticeable:

Customizations: If you have custom styling or event listeners attached to the line elements, this removal and re-insertion might trigger unintended behavior or performance issues.
Complex Content: If the lines contain complex content like embedded images or other rich media, the re-rendering might be more noticeable.
 */
export const quillBackspaceImageHandler = (
  removedNode: Node,
  followingAddedNone: Node | undefined
): removedNode is HTMLImageElement => {
  return (
    removedNode.nodeName.toLowerCase() === 'img' &&
    (!followingAddedNone || followingAddedNone.nodeName.toLowerCase() !== 'img')
  );
};
