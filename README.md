# Shadow-Align README

This extension allows adjacent lines to be aligned on the basis of a regular expression and a group array of characters.

## Features

- Select a group of line filtered by a regular expression
- Align a group of line based on an array of text
- Store the configuration in a template

You can setup multiple filters, then when formatting a selection, every filter will format every matching group of lines.

If you want a more advanced way to format, you can use the rxgTemplate section. In that case the regular expression should use named groups to capture all groups of the line, including the optional ones. the Array of string should define in the correct order every group name to format.

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
```typescript
  // With this configuration
 "shadow.align.rgxTemplates": {  
    "(?<param>\\s*\\*\\s*@param)\\s*(?<type>\\{.*?\\})\\s*(?<name>.*?)(?<sep>-)\\s*(?<desc>.*)":["param","type","name","sep","desc"]
  }

  // You can format this
 * @param {function} getValue- callback returns the value to check for stability.                             
 * @param {function} done- callback when getValue() stops changing.                                       
 * @param {number}[numFrames=2] - getValue() must not change for this many frames to be considered done changing.
  
 // To this 
 * @param {function} getValue      - callback returns the value to check for stability.                             
 * @param {function} done          - callback when getValue() stops changing.                                       
 * @param {number}   [numFrames=2] - getValue() must not change for this many frames to be considered done changing.
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
`shadow.align.rgxTemplates`: {
  [RegExp: string] : Array<string>;
}
```
## Release Notes
### 1.0.5
Added a way to split based on regex named groups

### 1.0.4
Updated readme

### 1.0.3
Minor fixes

### 1.0.0
Initial release of shadow-align
