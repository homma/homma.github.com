---
title: Blog エントリー追加手順のメモ
---
<link rel="stylesheet" href="../common.css" type="text/css" />

### Blog エントリーの追加手順
--------

#### blog/a ディレクトリ下に記事用のディレクトリを作成する

ディレクトリ名は任意  
同じ日に複数の記事を作成する場合は、適当にディレクトリ名を設定する

    % export DATE=`date +%Y/%m%d`
    % mkdir -p blog/a/${DATE}
    % cd blog/a/${DATE}

#### 記事のファイルを作成する

ファイル名は任意  
Markdown で記述する場合はファイル名の最後を .md にする
    
    % vi index.md

#### blog/a/article.py を編集して記事のファイルを追加する

entries 配列に記事の情報を追加する  
Markdown で記述したファイルは .md を除いたファイル名にする
    
    % cd ..
    % vi article.py

#### blog/s/bloggen.py を実行し、Blog の構成ファイルを生成する

    % cd ../s
    % ./bloggen.py

#### upload.sh で Github Page をアップデートする

    % cd ../..
    % ./upload.sh

### Tips and Memo
--------

#### Markdown で記述する際の Tips

* 先頭に title: ... を入れないと Markdown として認識されないっぽい
* code block は backquote で記述すると先頭に改行が入ってしまうのでインデントで
* stylesheet を使用する場合は先頭付近に link タグで挿入する

