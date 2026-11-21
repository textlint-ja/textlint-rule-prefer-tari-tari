// MIT © 2017 azu
"use strict";
import { tokenize } from "kuromojin";

const StringSource = require("textlint-util-to-string");
// definition
const 動詞 = (token) => token.pos === "動詞" && (token.pos_detail_1 === "自立" || token.pos_detail_1 === "非自立");
const たり = (token) => token.pos === "助詞" && (token.surface_form === "だり" || token.surface_form === "たり");
const する = (token) => token.basic_form === "する";
const TARI_SURU = [動詞, たり, する];
const TARI = [動詞, たり];
const VERB = [動詞];
/**
 * Convert half-width symbols to full-width symbols before tokenizing
 * @param {string} text
 * @returns {string}
 */
const toWideSymbolForJapanese = (text) => {
    return text.replace(/[｡｢｣､･]/g, (symbol) => {
        return { "｡": "。", "｢": "「", "｣": "」", "､": "、", "･": "・" }[symbol];
    });
};
/**
 * Split tokens into sentences.
 * A sentence ends with 句点 that is not in brackets.
 * Each item has the token, the index of the token in the text, and whether the token is a word.
 * 空白, 括弧, and 句点 are not words.
 * @param {readonly import("kuromojin").KuromojiToken[]} tokens
 */
const splitSentences = (tokens) => {
    const sentences = [];
    let sentence = [];
    let depth = 0;
    let index = 0;
    tokens.forEach((token, tokenIndex) => {
        const pos_detail_1 = token.pos_detail_1;
        const isWord = !["空白", "括弧開", "括弧閉", "句点"].includes(pos_detail_1);
        sentence.push({ token, index, isWord });
        index += token.surface_form.length;
        if (pos_detail_1 === "括弧開") {
            depth++;
        } else if (pos_detail_1 === "括弧閉") {
            depth--;
        } else if (pos_detail_1 === "句点" && depth === 0 && tokenIndex !== tokens.length - 1) {
            sentences.push(sentence);
            sentence = [];
        }
    });
    if (sentence.length > 0) {
        sentences.push(sentence);
    }
    return sentences;
};
/**
 * Find the sequences of words that match the patterns.
 * When a word does not match, the search starts again from the next word.
 * @param {ReturnType<typeof splitSentences>[number]} sentence
 * @param {((token) => boolean)[]} patterns
 * @returns {number[]} the positions in the sentence of the first words of the sequences
 */
const match = (sentence, patterns) => {
    const results = [];
    let matchCount = 0;
    sentence.forEach((item, position) => {
        if (item.isWord && patterns[matchCount](item.token)) {
            matchCount++;
        } else {
            matchCount = 0;
        }
        if (matchCount === patterns.length) {
            results.push(position - patterns.length + 1);
            matchCount = 0;
        }
    });
    return results;
};
const report = (context) => {
    const { Syntax, RuleError, report } = context;
    return {
        [Syntax.Paragraph](node) {
            const source = new StringSource(node);
            const text = source.toString();
            // Check the first line of the paragraph
            const firstLine = text.split(/\r?\n/)[0];
            if (firstLine === "") {
                return;
            }
            return tokenize(toWideSymbolForJapanese(firstLine)).then((tokens) => {
                splitSentences(tokens).forEach((sentence) => {
                    const tariResults = match(sentence, TARI);
                    const tariSuruResults = match(sentence, TARI_SURU);
                    // `${動詞}${たり}` かつ `${動詞}${たり}${する}` の場合は除外
                    if (tariResults.some((tari) => tariSuruResults.includes(tari))) {
                        return;
                    }
                    if (tariResults.length !== 1) {
                        return;
                    }
                    const firstTari = sentence[tariResults[0]];
                    const afterSuru = match(sentence, VERB).find((position) => {
                        const prevItem = sentence[position - 1];
                        // 逃げ"たり"しない のようなパターン
                        const prevIsNotTari = prevItem !== undefined && prevItem.token.surface_form !== "たり";
                        // 最初の"たり"より後ろ
                        return prevIsNotTari && sentence[position].index > firstTari.index;
                    });
                    if (afterSuru === undefined) {
                        return;
                    }
                    report(
                        node,
                        new RuleError(
                            `例示・並列・対表現において、片方の動詞が「〜たり」表現な場合は、もう片方の動詞も「〜たり」とします。`,
                            {
                                index: source.originalIndexFromIndex(sentence[afterSuru].index)
                            }
                        )
                    );
                });
            });
        }
    };
};
module.exports = {
    linter: report,
    fixer: report
};
