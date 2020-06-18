// Copyright (C) 2020, Orkhan Alikhanov <http://orkhanalikhanov.com>. All rights reserved.

import { Transaction } from 'prosemirror-state';
import { ReplaceAttrsStep } from './lib/ReplaceAttrsStep';

declare module 'prosemirror-state' {
  interface Transaction {
    /**
     * Replace the attributes the `attrs` of the node at the give `pos`.
     *
     * @param pos - Position of the node at the document.
     * @param attrs - New attrs to set.
     * @returns new Transaction with replace attrs step added.
     *
     */
    replaceAttrs(pos: number, attrs: any): Transaction;
  }
}

Transaction.prototype.replaceAttrs = function replaceAttrs(
  pos: number,
  attrs: any
): Transaction {
  return this.step(new ReplaceAttrsStep(pos, attrs));
};

export { ReplaceAttrsStep };
