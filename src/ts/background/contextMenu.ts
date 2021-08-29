module background {
    /**
     * コンテキストメニュー
     */
    // 親メニュー追加
    const parentId = chrome.contextMenus.create({
        id: 'parent',
        title: 'Web-Shiori',
        contexts: ['all'],
    });

    // 子メニュー1追加
    chrome.contextMenus.create({
        id: 'child1',
        title: '選択したテキストへのリンクをWeb-Shioriに保存する',
        contexts: ['all'],
        parentId: parentId,
    });

    // 子メニュー2追加
    chrome.contextMenus.create({
        id: 'child2',
        title: '選択したテキストへのリンクをクリップボードにコピー',
        contexts: ['all'],
        parentId: parentId,
    });

    // コンテキストメニュークリック時の処理
    chrome.contextMenus.onClicked.addListener(function (info) {
        console.log(JSON.stringify(info));
        console.log(info.selectionText);
        if (info.menuItemId === 'child1') {
            // 子メニュー1をクリックしたときの処理
            chrome.runtime.sendMessage({
                msg: 'contextMenu',
                data: {
                    url: info.pageUrl,
                    selectionText: info.selectionText,
                },
            });
        } else if (info.menuItemId === 'child2') {
            // 子メニュー2をクリックしたときの処理
            // 選択されたテキストへのリンクを生成
            const urlWithSpecifiedText =
                info.pageUrl + '#:~:text=' + info.selectionText;
            saveToClipboard(urlWithSpecifiedText);
        }
    });

    // 文字列をクリップボードにコピーする
    function saveToClipboard(str: string | undefined) {
        const textArea = document.createElement('textarea');
        document.body.appendChild(textArea);
        textArea.value = str ?? '';
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}
