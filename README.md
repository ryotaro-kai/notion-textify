
# Notion Textify

A Google Chrome Extension that converts Notion content into clean, readable text format.

## Features

- Extract text from Notion pages
- Remove formatting and clutter
- Copy plain text to clipboard
- Simple one-click operation

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this folder

## Usage

1. Open any Notion page
2. Click "Textify Notion Page Content" in context menu
3. Your content is converted and copied to clipboard
4. Paste as plain text anywhere

## CAUTION

Please note: Only some Notion formats are supported.

```
    if (classes.includes('notion-header-block') || classes.includes('notion-sub_header-block') || classes.includes('notion-sub_sub_header-block')) {
    prefix = "*"; suffix = "*";
    } else if (classes.includes('bulleted_list')) {
    prefix = "・ ";
    } else if (classes.includes('numbered_list')) {
    // Convert numbered lists to bullet points
    prefix = "・ ";
    } else if (classes.includes('to_do')) {
    const isChecked = blockContainer.querySelector('[aria-checked="true"]');
    prefix = (isChecked ? '[x] ' : '[ ] ');
    } else if (classes.includes('quote')) {
    prefix = "> ";
    } else if (classes.includes('toggle')) {
    // Toggles are not supported
    // prefix = "▶ ";
    }
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT License
