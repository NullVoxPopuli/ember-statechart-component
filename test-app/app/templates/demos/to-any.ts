/* eslint-disable @typescript-eslint/no-explicit-any */

import { get } from '@ember/object';

export default function toString(x: any, path: string) {
  return get(x, path);
}
