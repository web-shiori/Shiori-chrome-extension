module background {
	// メッセージが送られてきたときの処理
    chrome.runtime.onMessage.addListener((content: Content) => {
        setScrollPosition(content.scroll_position_x, content.scroll_position_y)
        setVideoPlayBackPosition(content.video_playback_position)
    })

	// TODO: loadedmetadataイベントが発生した後に再生位置を設定する
    function setVideoPlayBackPosition(videoPlayBackPosition: number) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            chrome.tabs.executeScript(<number>tabs[0].id, {
                code: `const videoPlayBackPosition = ` + videoPlayBackPosition
            }, () => {
                chrome.tabs.executeScript(<number>tabs[0].id, {
                    code: `document.getElementsByTagName('video')[0].currentTime = videoPlayBackPosition;`
                })
            })
        })
    }

    function setScrollPosition(scrollPositionX: number, scrollPositionY: number) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            chrome.tabs.executeScript(<number>tabs[0].id, {
                code: `
                const scrollPositionX = ${scrollPositionX}
                const scrollPositionY = ${scrollPositionY}
            `
            }, () => {
                chrome.tabs.executeScript(<number>tabs[0].id, {
                    code: `
                    window.scrollTo(scrollPositionX, scrollPositionY);
                `
                })
            })
        })
    }

    chrome.webRequest.onHeadersReceived.addListener(
        function (details) {
            const uid = details.responseHeaders?.find(header => header.name.toLowerCase() === "uid")
            const client = details.responseHeaders?.find(header => header.name.toLowerCase() === "client")
            const accessToken = details.responseHeaders?.find(header => header.name.toLowerCase() === "access-token")
            chrome.storage.sync.set({'uid': uid}, function() {
                console.log('uid saved');
            });
            chrome.storage.sync.set({'client': client}, function() {
                console.log('client saved');
            });
            chrome.storage.sync.set({'accessToken': accessToken}, function() {
                console.log('accessToken saved');
            });

            // ログイン画面を閉じる
            // const windows = chrome.extension.getViews({type: "popup"})
            // console.log(windows)
            // windows.map(w => w.close())
        },
        { urls: ['https://web-shiori.herokuapp.com/*'] },
        ['responseHeaders']
    )
}
