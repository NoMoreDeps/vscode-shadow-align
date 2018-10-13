import * as vscode        from 'vscode'         ;
import { Line }           from './Line'         ;
import { extendToLength } from './string-utils' ;

type Range = {
    range     : Array<Array<number>> ;
    alignSpec : string[]             ;
};
export class Block {

    lines: Line[]    = [] ;
    target: string[] = [] ;

    getGroupsFromRegExp(rgXep: string, alignSpec: string[], lines: Array<Line>) {
        const regExp                    = new RegExp(rgXep) ;
        let isValid                     = false             ;
        let range: Array<Array<number>> = []                ;
        let curRange: Array<number>     = []                ;

        lines.forEach(_ => {
            if (_.processed) return;

            const res = regExp.exec(_.original);
            if (res !== null && res.length > 0) {
                if (isValid) {
                    curRange.push(_.number);
                } else {
                    isValid  = true       ;
                    curRange = [_.number] ;
                }
            } else {
                if (isValid) {
                    isValid = false;
                    if (curRange.length > 1) {
                        curRange.forEach(r => {
                            lines.filter(l => l.number === r)[0].processed = true;
                        });
                        range.push(curRange);
                    }
                    curRange = [];
                }
            }
        });

        if (curRange.length > 1) {
            range.push(curRange);
        }

        return {
            range: range,
            alignSpec: alignSpec
        } as Range
    }

    constructor(text: string, inputs: { [regEx: string]: string[] }, startLine: number, eol: vscode.EndOfLine) {
        let splitString : string            ;
        let ranges      : Array<Range> = [] ;

        if (eol === vscode.EndOfLine.CRLF) {
            splitString = '\r\n';
        } else {
            splitString = '\n';
        }

        let textLines = text.split(splitString).map((_, idx) => {
            return {
                number   : startLine + idx ,
                parts    : []              ,
                original : _               ,
                processed: false
            } as Line
        });

        for (let input in inputs) {
            const range = this.getGroupsFromRegExp(input, inputs[input], textLines);
            ranges.push(range);

            range.range.forEach(rg => {
                const separators = range.alignSpec;

                rg.map(lineNumber => textLines.filter(l => l.number === lineNumber)[0]).forEach(line => {
                    separators.forEach((inp, idx) => {
                        if (line.original.indexOf(inp) !== -1) {
                            let tmpTab  = line.original.split(inp) ;
                            let shifted = tmpTab.shift() as string ;
                            if (shifted) {
                                if (idx === 0) {
                                    while (shifted.endsWith(" ")) {
                                        shifted = shifted.substr(0, shifted.length - 1);
                                    }
                                    line.parts.push(shifted);
                                } else {
                                    line.parts.push(shifted.trim());
                                }
                                line.parts.push(inp);
                                if (tmpTab.length == 1) {
                                    line.original = tmpTab[0];
                                } else {
                                    line.original = tmpTab.join(inp);
                                }
                            }
                        }
                    });

                    if (line.original.length > 0) {
                        line.parts.push(line.original.trim());
                    }
                });

            });
        }

        ranges.forEach(range => {
            range.range.forEach(r => {

                var maxLength: number[] = [];

                textLines.filter(l => r.indexOf(l.number) !== -1).forEach(line => {
                    line.parts.forEach((part, idx) => {
                        if (!maxLength[idx]) {
                            maxLength[idx] = 0;
                        }
                        if (part.length > maxLength[idx]) {
                            maxLength[idx] = part.length;
                        }
                    });
                });

                textLines.filter(l => r.indexOf(l.number) !== -1).forEach(line => {
                    for (let i = 0; i < line.parts.length; i++) {
                        line.parts[i] = extendToLength(line.parts[i], maxLength[i]);
                    }
                });

            });

        });

        textLines.forEach(line => {
            this.target.push(line.parts.length > 0 ? line.parts.join(" ") : line.original);
        })
    }
}