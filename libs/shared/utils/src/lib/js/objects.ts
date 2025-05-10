/** Helper function to handle circular references if you still try to stringify complex sub-objects.
 *  Can be used in JSON.stringify calls, e.g. JSON.stringify(requestInfoToLog, getCircularReplacer(), 2).
 * (Optional but Safer): If any of the selected properties you want to log still happen to have circular references, this replacer will prevent JSON.stringify from crashing by replacing circular parts with [Circular].
 *
 * You'd use it like JSON.stringify(requestInfoToLog, getCircularReplacer(), 2)
 *
 **/
export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (kye: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'; // Replace circular reference
      }
      seen.add(value);
    }
    return value;
  };
};
