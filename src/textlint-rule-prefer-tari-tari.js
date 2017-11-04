// MIT © 2017 azu
"use strict";
import { JapaneseParser } from "nlcst-parse-japanese";
import { PatternMatcher, match } from "nlcst-pattern-match";

const japaneseParser = new JapaneseParser();
const StringSource = require("textlint-util-to-string");
const nlcstToString = require("nlcst-to-string");
const hasTariWord = word => {};
const report = context => {
    const { Syntax, RuleError, getSource, fixer, report } = context;
    return {
        [Syntax.Paragraph](node) {
            return japaneseParser.ready().then(() => {
                const matcher = new PatternMatcher({
                    parser: japaneseParser
                });
                const TARI = [
                    {
                        type: "WordNode",
                        data: {
                            pos: "動詞",
                            pos_detail_1: "自立"
                        }
                    },
                    {
                        type: "WordNode",
                        data: {
                            pos: "助詞",
                            surface_form: ["だり", "たり"]
                        }
                    }
                ];
                const VERB = [
                    {
                        type: "WordNode",
                        data: {
                            pos: "動詞",
                            pos_detail_1: "自立"
                        }
                    }
                ];
                const source = new StringSource(node);
                const text = source.toString();
                const CST = japaneseParser.parse(text);
                const sentences = CST.children[0].children;
                sentences.forEach(sentence => {
                    const tariResults = matcher.matchCST(sentence, TARI);
                    console.log(tariResults);
                    if (tariResults.length === 1) {
                        const suru = matcher.matchCST(sentence, VERB);
                        const afterSuru = suru.find(suru => {
                            const firstToken = tariResults[0].nodeList[0];
                            const suruFirstToken = suru.nodeList[0];
                            const prevSuruNode = sentence.children[sentence.children.indexOf(suruFirstToken) - 1];
                            // 逃げ"たり"しない のようなパターン
                            const prevIsNotTari = prevSuruNode && nlcstToString(prevSuruNode) !== "たり";
                            // 最初の"たり"より後ろ
                            return (
                                prevIsNotTari &&
                                suruFirstToken.position.start.offset > firstToken.position.start.offset &&
                                // not たり
                                match(suru.nodeList, TARI)
                            );
                        });
                        if (!afterSuru) {
                            return;
                        }
                        // report
                        console.log(afterSuru.nodeList);
                        report(
                            node,
                            new RuleError(`EERR`, {
                                index: source.originalIndexFromIndex(afterSuru.position.index)
                            })
                        );
                    }
                });
            });
        }
    };
};
module.exports = {
    linter: report,
    fixer: report
};
