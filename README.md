# prosemirror-replaceattrs

The missing ReplaceAttrsStep for prosemirror

# Usage
```js
import 'prosemirror-replaceattrs' /// somewhere in your project

tr.replaceAttrs(pos, attrs)
```

# Why
In prosemirror, in order to update attributes of a node, you must delete it and replace with a new node with updated attributes. Something like this:
```js
state.tr.setNodeMarkup(state.selection.from, undefined, attrs)
/// or
newNode = node.copy()
newNode.attrs = attrs
state.tr.replaceWith(pos, pos + 1, newNode)
```

While this works perfectly, during collaboration it does not go well with undo history. Suppose user A inserts an image node and user B updates alt attribute of that image node. When user A hits undo, it should remove the inserted image, but it will not if you've replaced the entire node. This `ReplaceAttrsStep` solves that problem if you use it to update attributes of a node.