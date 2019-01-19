import * as vscode        from 'vscode'         ;
import { Line }           from './Line'         ;
import { extendToLength } from './string-utils' ;
import * as XRegExp       from 'xregexp'        ;

type Range = {
    range     : Array<Array<number>> ;
    alignSpec : string[]             ;
};
export class RxgBlock {

    lines  : Line[]   = [] ;
    target : string[] = [] ;

    getGroupsFromRegExp(rgXep: string, alignSpec: string[], lines: Array<Line>) {
        const regExp                    = XRegExp(rgXep) ;
        let isValid                     = false          ;
        let range: Array<Array<number>> = []             ;
        let curRange: Array<number>     = []             ;

        lines.forEach(_ => {
            if (_.processed) return;

            const res = XRegExp.exec(_.original, regExp);
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
                    let regEx = XRegExp(input);
                    let regExMatch = XRegExp.exec(line.original, regEx);

                    separators.forEach((_inp, idx) => {
                        const inp = _inp.split("|")[0];
                        let partValue = ((regExMatch as any)[inp] as string);
                        partValue = partValue || "";
                        if (idx === 0) {
                            while (partValue.endsWith(" ")) {
                                partValue = partValue.substr(0, partValue.length - 1);
                            }
                            line.parts.push(partValue);
                        } else {
                            line.parts.push(partValue.trim());
                        }
                    });
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
                        line.parts[i] = extendToLength(line.parts[i], maxLength[i], range.alignSpec[i]);
                    }
                });

            });

        });

        textLines.forEach(line => {
            this.target.push(line.parts.length > 0 ? line.parts.join(" ") : line.original);
        })
    }
}