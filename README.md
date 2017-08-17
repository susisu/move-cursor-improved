# move-cursor-improved
Improve Atom's cursor movement.

## Features
### Correct cursor's up/down movement
Without this package:

![screenshot](https://github.com/susisu/move-cursor-improved/wiki/images/without-mci.gif)

With this package:

![screenshot](https://github.com/susisu/move-cursor-improved/wiki/images/with-mci.gif)

Atom's default cursor movement is based on characters' code units, that looks very strange for "wide" characters, especially used in the East Asian languages.
This package corrects it to be visually intuitive.

### Commands
There are some commands available, very similar to those provided by the [multi-cursor](https://atom.io/packages/multi-cursor) package, but work in visually intuitive way.

|       name        |                      description                      |
| ----------------- | ----------------------------------------------------- |
| Add Next Line     | Create a cursor in the next line for each cursor.     |
| Add Previous Line | Create a cursor in the previous line for each cursor. |

You may want to add keymaps to your `keymap.cson`:

``` coffee
'atom-text-editor:not(.mini)':
  'alt-down': 'move-cursor-improved:add-next-line'
  'alt-up'  : 'move-cursor-improved:add-previous-line'
```

## Recommendations
* [rectangle-selection](https://atom.io/packages/rectangle-selection) is useful for selections.
