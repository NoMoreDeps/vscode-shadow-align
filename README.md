# Shadow-Align README

This extension allows adjacent lines to be aligned on the basis of a regular expression and a group array of characters.

## Features

- Select a group of line filtered by a regular expression
- Align a group of line based on an array of text
- Store the configuration in a template

You can setup multiple filters, then when formatting a selection, every filter will format every matching group of lines.

## Examples

Setting configuration sample: <br />
```json
 "shadow.align.templates": {  
    "import.*?{.*?}.*?from.*?;" : ["{","from",";"] ,
    ".*?=[^>].*?;\\s*$"         : ["=", ";"]       ,
    ".*?:.*?,\\s*$"             : [":", ","]       ,
    ".*?:.*?;\\s*$"             : [":", ";"]       ,
    "^\\s*?\\|.*"               : ["|","|","|","|","|","|","|","|","|"]
  }
```


Formating based on several pattern.
To format, press Alt+Shift+A
![Formatting overview](images/align.gif)

## Extension Settings

This extension contributes the following settings:

```typescript
`shadow.align.templates`: {
  [RegExp: string] : Array<string>;
}
```
## Release Notes

### 1.0.4
Updated readme

### 1.0.3
Minor fixes

### 1.0.0
Initial release of shadow-align
