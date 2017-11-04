# textlint-rule-prefer-tari-tari [![Build Status](https://travis-ci.org/textlint-ja/textlint-rule-prefer-tari-tari.svg?branch=master)](https://travis-ci.org/textlint-ja/textlint-rule-prefer-tari-tari)

「〜たり〜たりする」をチェックするtextlintルール

例示・並列表現の「～たり、（～たり）する」をチェックするルールです。
次の例のように、片方が「〜たり」表現なのにもかかわらず、もう片方の動詞が「〜たり」ではない場合をエラーとします。

> 階段を上がったり、下がる。

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-prefer-tari-tari

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "prefer-tari-tari": true
    }
}
```

Via CLI

```
textlint --rule prefer-tari-tari README.md
```

## Example

**OK**:

```
晴れたり泣いたり あとは時々 歌ってみたり
プログラムを書いたり、提出する文章を書いたりする
トイレに行ったり、ご飯を食べたりする時間もない。
テレビを見たり、トイレに行ったり、ご飯を食べたりする時間もない。
週末は買い物をしたりカフェに行ったりします。
ジョンさんとは英語で話したり日本語で話したりします。
昨日は、カフェに行ったり本屋に行ったりしました。
暇な時は映画を見たり、音楽を聞いたりします。
インドの映画ではよく歌ったり踊ったりして面白い。
韓国に行ったら、サムゲタンを食べたり、サムギョプサルを食べたりしたい。
朝は歯を磨いたり顔を洗ったり、ちょっと忙しい。
ディズニーランドではジェットコースターに乗ったり、パレード見たりするのが好きです。
彼氏ができたら、映画を見に行ったり、遊園地に行ったりしたい。
うちのサークルはミーティングがあったり、合宿があったり、大会があったりして、忙しいけど楽しいですよ。
図書館では本や雑誌を読んだり、勉強したりする人が多い。
日本では、学校で勉強したり、旅行したりした。
火事の時は、走ったり、前の人を押したりしないで、避難しましょう。
新しい漫画を買ったり、ゲームを買ったりしているとすぐにお金がなくなる。
レポートを書くために、インターネットで調べたり図書館で調べたりした。
健康のために、野菜を食べたり魚を食べたりしている。
(1)わたしは夏休みにテニスをしたり泳いだりしました。

(2)日曜日に弟は本を読んだりテレビを見たりしています。

(3)友だちとよく映画を見たりプールに行ったりします。

友だちとよく映画を見たりプールに行ったりします。

飛行機で東京と大阪を行ったり来たりします。

雨が降ったりやんだりしています。

動物園のシロクマは、おりの中を、行ったり来たりしている。
赤ちゃんは、泣いたり、笑ったり、かわいいですね。
大きかったり小さかったりなどして、なかなか体に合うのがない
白一色になった畠の中に散在する農家はプレハブ住宅であったり茅葺きであったりした
薄暗い階段や廊下では観客が食べたり呑んだりしている
高かったりまずかったりする
お前あんまり変なことに関わり合ったりしない方がいいよ
ジョークが言えなくても、せめて怒ったりするな。理屈っぽいこと言うな。
紙で答えを求めたりしたらそれこそデジタル的な指向ではないです
あら私は別に逃げ出したりしませんよ
私は路頭に迷ったりするのは嫌だから文章を書きます。
私は笑ったりしないよ。
```

**NG**:

```
プログラムを書いたり、文章を書いている
トイレに行ったり、ご飯を食べる時間もない。
遊んだり学ぶのを手助けする
階段を上がったり、下がる。
歌と歌ったり、踊りを踊る
```



**Notes**:

「〜たり」は必ずもう片方が「〜たり」となるわけではありません。
あくまで例示・並列・対の動作の表現などにおける「〜たり」がそのように扱われます。
(英語の`and`や`or`などが感覚としては近いと思います)

一方、「〜たり」の表現はかなり多用であるため、誤検知があるかもしれません。

- [「(～たり、) ～たりする」文の意味・用法について](http://dspace.lib.kanazawa-u.ac.jp/dspace/bitstream/2297/1885/1/AA11546136-5-1.pdf "AA11546136-5-1.pdf")

## Reference

> 表現上の効果などから「～たりする」が使われていないものがたくさんあるのです。
> 「日本語では『～たり～たりする』という形になる傾向がある」というように覚えたりしておく程度が、無難なのではないでしょうか。

- [「～たり～たりする」？ | ことば（放送用語） - 最近気になる放送用語 | NHK放送文化研究所](https://www.nhk.or.jp/bunken/summary/kotoba/term/132.html "「～たり～たりする」？ | ことば（放送用語） - 最近気になる放送用語 | NHK放送文化研究所")
- [「(～たり、) ～たりする」文の意味・用法について](http://dspace.lib.kanazawa-u.ac.jp/dspace/bitstream/2297/1885/1/AA11546136-5-1.pdf "AA11546136-5-1.pdf")
- [Japanese Grammar - 〜たり〜たりする | PuniPuniJapan](http://www.punipunijapan.com/japanese-grammar-tari-tari/ "Japanese Grammar - 〜たり〜たりする | PuniPuniJapan")
- [～たり、～たり【JLPT N5 Grammar】 | 日本語の例文](http://j-nihongo.com/tari/ "～たり、～たり【JLPT N5 Grammar】 | 日本語の例文")


## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-prefer-tari-tari/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-prefer-tari-tari/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
