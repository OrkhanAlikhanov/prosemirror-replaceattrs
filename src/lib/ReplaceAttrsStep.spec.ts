// Copyright (C) 2020, Orkhan Alikhanov <http://orkhanalikhanov.com>. All rights reserved.

import test from 'ava';
import { Schema } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import '../index';

function makeExpectedDocJson(height: number, width: number, size: number) {
  return {
    type: 'doc',
    content: [
      {
        type: 'page',
        attrs: { height, width },
        content: [
          {
            type: 'paragraph',
            attrs: { size },
            content: [{ type: 'text', text: 'a' }]
          }
        ]
      }
    ]
  };
}

test('Test replacing and inverting attributes of multiple nodes', t => {
  const s = new Schema({
    nodes: {
      text: { inline: true },
      doc: {
        content: 'page+'
      },
      page: {
        content: 'paragraph',
        attrs: { height: { default: 0 }, width: { default: 0 } }
      },
      paragraph: { content: 'text*', attrs: { size: { default: 0 } } }
    }
  });

  const doc = s.node('doc', undefined, [
    s.node('page', { height: 1, width: 2 }, [
      s.node('paragraph', undefined, [s.text('a')])
    ])
  ]);

  let state = EditorState.create({
    doc,
    selection: TextSelection.near(doc.resolve(1))
  });

  t.deepEqual(state.doc.toJSON(), makeExpectedDocJson(1, 2, 0));

  // Replace page attributes
  const replacePageAttrs = state.tr.replaceAttrs(0, { height: 11, width: 22 });
  state = state.applyTransaction(replacePageAttrs).state;
  t.deepEqual(state.doc.toJSON(), makeExpectedDocJson(11, 22, 0));

  // Replace paragraph attributes
  const replaceParagraphAttrs = state.tr.replaceAttrs(1, { size: 33 });
  state = state.applyTransaction(replaceParagraphAttrs).state;
  t.deepEqual(state.doc.toJSON(), makeExpectedDocJson(11, 22, 33));

  // Invert replacing paragraph attributes
  state = state.applyTransaction(
    state.tr.step(replaceParagraphAttrs.steps[0].invert(state.doc))
  ).state;
  t.deepEqual(state.doc.toJSON(), makeExpectedDocJson(11, 22, 0));

  // Invert replacing page attributes
  state = state.applyTransaction(
    state.tr.step(replacePageAttrs.steps[0].invert(state.doc))
  ).state;
  t.deepEqual(state.doc.toJSON(), makeExpectedDocJson(1, 2, 0));
});
