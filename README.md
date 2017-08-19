# move-cursor-improved
Improve Atom's cursor movement.

## Features
### Correct cursor's up/down movement
Without this package:

![screenshot](https://github.com/susisu/move-cursor-improved/wiki/images/without-mci.gif)

With this package:

![screenshot](https://github.com/susisu/move-cursor-improved/wiki/images/with-mci.gif)

Atom's default cursor movement is based on characters' code units, that looks very strange for "wide" characters, used especially in the East Asian languages.
This package corrects it to be visually intuitive.

### Commands
The package also provides some commands.
These are (visually intuitive) alternatives to the commands provided by the [multi-cursor](https://atom.io/packages/multi-cursor) package.

|          Name          |                        Description                         |                                Windows                                 |                        macOS                        |                                 Linux                                  |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| Add Previous Line      | Create a cursor in the previous (up) line for each cursor. | <kbd>alt</kbd> + <kbd>up</kbd>                                         | <kbd>alt</kbd> + <kbd>up</kbd>                      | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>up</kbd>                     |
| Add Next Line          | Create a cursor in the next (down) line for each cursor.   | <kbd>alt</kbd> + <kbd>down</kbd>                                       | <kbd>alt</kbd> + <kbd>down</kbd>                    | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>down</kbd>                   |
| Move Last Cursor Up    | Move the most recently added cursor up.                    | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>up</kbd>    | <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>up</kbd>    | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>up</kbd>    |
| Move Last Cursor Down  | Move the most recently added cursor down.                  | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>down</kbd>  | <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>down</kbd>  | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>down</kbd>  |
| Move Last Cursor Left  | Move the most recently added cursor left.                  | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>left</kbd>  | <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>left</kbd>  | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>left</kbd>  |
| Move Last Cursor Right | Move the most recently added cursor right.                 | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>right</kbd> | <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>right</kbd> | <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>right</kbd> |

You may want to customize keymaps by yourself:

``` coffee
'atom-text-editor:not(.mini)':
  'alt-up'        : 'move-cursor-improved:add-previous-line'
  'alt-down'      : 'move-cursor-improved:add-next-line'
  'ctrl-alt-down' : 'move-cursor-improved:move-last-cursor-down'
  'ctrl-alt-up'   : 'move-cursor-improved:move-last-cursor-up'
  'ctrl-alt-left' : 'move-cursor-improved:move-last-cursor-left'
  'ctrl-alt-right': 'move-cursor-improved:move-last-cursor-right'
```

## Recommended packages
* [rectangle-selection](https://atom.io/packages/rectangle-selection) is useful for multi-line selections.
