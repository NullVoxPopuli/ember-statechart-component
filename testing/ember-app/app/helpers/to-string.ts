/* eslint-disable @typescript-eslint/no-explicit-any */
export default function toString(x: any) {
  if (typeof x === 'string') {
    return x;
  }

  if (typeof x === 'object') {
    if (!x) return '';

    if ('toStrings' in x) return x.toStrings();
    if ('toString' in x) return x.toString();
  }

  return `${x}`;
}
