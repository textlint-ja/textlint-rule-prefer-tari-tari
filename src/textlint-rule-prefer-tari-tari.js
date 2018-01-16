// MIT © 2017 azu
"use strict";
import { JapaneseParser } from "nlcst-parse-japanese";
import { match, PatternMatcher } from "nlcst-pattern-match";

const japaneseParser = new JapaneseParser();
const StringSource = require("textlint-util-to-string");
const nlcstToString = require("nlcst-to-string");
// definition
const 動詞 = {
    type: "WordNode",
    data: {
        pos: "動詞",
        pos_detail_1: ["自立", "非自立"]
    }
};
const たり = {
    type: "WordNode",
    data: {
        pos: "助詞",
        surface_form: ["だり", "たり"]
    }
};
const する = {
    type: "WordNode",
    data: {
        basic_form: "する"
    }
};
const report = context => {
    const { Syntax, RuleError, report } = context;
    return {
        [Syntax.Paragraph](node) {
            return japaneseParser.ready().then(() => {
                const matcher = new PatternMatcher({
                    parser: japaneseParser
                });
                const TARI_SURU = matcher.tag`${動詞}${たり}${する}`;
                const TARI = matcher.tag`${動詞}${たり}`;
                const VERB = matcher.tag`${動詞}`;
                const source = new StringSource(node);
                const text = source.toString();
                const CST = japaneseParser.parse(text);
                // Ignore empty Paragraph. Ex) '<p></p>'
                if (typeof CST.children === "undefined" || CST.children.length == 0) {
                    return;
                }
                const sentences = CST.children[0].children;
                const isSameNode = (resultsA, resultsB) => {
                    return resultsA.some(resultA => {
                        return resultsB.some(resultB => {
                            return resultB.index === resultA.index;
                        });
                    });
                };
                sentences.forEach(sentence => {
                    const tariResults = matcher.matchCST(sentence, TARI);
                    const tariSuruResults = matcher.matchCST(sentence, TARI_SURU);
                    // `${動詞}${たり}` かつ `${動詞}${たり}${する}` の場合は除外
                    if (isSameNode(tariResults, tariSuruResults)) {
                        return;
                    }
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
                        // console.log(afterSuru.nodeList);
                        report(
                            node,
                            new RuleError(
                                `例示・並列・対表現において、片方の動詞が「〜たり」表現な場合は、もう片方の動詞も「〜たり」とします。`,
                                {
                                    index: source.originalIndexFromIndex(afterSuru.position.index)
                                }
                            )
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
