// Copyright (C) 2020, Orkhan Alikhanov <http://orkhanalikhanov.com>. All rights reserved.

import { Fragment, Node, Schema, Slice } from 'prosemirror-model';
import { Step, StepResult } from 'prosemirror-transform';

export class ReplaceAttrsStep<S extends Schema> extends Step<S> {
  /**
   * {@inheritDoc}
   */
  public static fromJSON(_schema: Schema, json: any) {
    return new ReplaceAttrsStep(json.at, json.attrs, json.oldAttrs);
  }

  /**
   * @param at The position of node whose attrs should be updated.
   * @param attrs New attribues to set.
   */
  constructor(public at: number, public attrs: any, public oldAttrs: any = {}) {
    super();
  }

  /**
   * {@inheritDoc}
   */
  public apply(doc: Node) {
    const node = doc.nodeAt(this.at);
    if (!node) {
      return StepResult.fail('Node could not be found');
    }

    this.oldAttrs = node.attrs;
    const newNode = node.copy(node.content);
    newNode.attrs = this.attrs;

    return StepResult.ok(
      doc.replace(
        this.at,
        this.at + node.nodeSize,
        new Slice(Fragment.from(newNode), 0, 0)
      )
    );
  }

  /**
   * {@inheritDoc}
   */
  public invert() {
    return new ReplaceAttrsStep(this.at, this.oldAttrs, this.attrs);
  }

  /**
   * {@inheritDoc}
   */
  public map(mapping: any) {
    const at = mapping.mapResult(this.at);
    return at.deleted
      ? null
      : new ReplaceAttrsStep(at.pos, this.attrs, this.oldAttrs);
  }

  /**
   * {@inheritDoc}
   */
  public merge(other: Step): Step | null {
    if (other instanceof ReplaceAttrsStep && other.at === this.at) {
      return new ReplaceAttrsStep(this.at, this.attrs, this.oldAttrs);
    }

    return null;
  }

  /**
   * {@inheritDoc}
   */
  public toJSON() {
    return {
      attrs: this.attrs,
      oldAttrs: this.oldAttrs,
      at: this.at,
      stepType: 'replaceAttrs'
    };
  }
}

Step.jsonID('replaceAttrs', ReplaceAttrsStep);
