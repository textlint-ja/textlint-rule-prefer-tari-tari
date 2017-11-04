// MIT © 2017 azu
"use strict";
const { IgnoreNodeManager } = require("textlint-rule-helper");
const StringSource = require("textlint-util-to-string");
export const paragraphReporter = ({ node, ignoreNodeTypes, context }) => {
    const originalText = context.getSource(node);
    const source = new StringSource(node);
    const text = source.toString();
    const ignoreNodeManager = new IgnoreNodeManager();
    // Ignore following pattern
    // Paragraph > Link Code Html ...
    ignoreNodeManager.ignoreChildrenByTypes(node, ignoreNodeTypes);
    const index = source.originalIndexFromIndex(result.index);
    const endIndex = source.originalIndexFromIndex(result.index + result.match.length);
    const range = [index, endIndex];
    // if the error is ignored, don't report
    if (ignoreNodeManager.isIgnoredRange(range)) {
        return;
    }
};
