module background {
    // メッセージが送られてきたときの処理
    chrome.runtime.onMessage.addListener((content: Content) => {
        setScrollPosition(content.scroll_position_x, content.scroll_position_y);
        setVideoPlayBackPosition(content.video_playback_position);
    });

    // TODO: loadedmetadataイベントが発生した後に再生位置を設定する
    // 動画再生位置を復元する
    function setVideoPlayBackPosition(videoPlayBackPosition: number) {
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
                chrome.tabs.executeScript(
                    <number>tabs[0].id,
                    {
                        code:
                            `const videoPlayBackPosition = ` +
                            videoPlayBackPosition,
                    },
                    () => {
                        chrome.tabs.executeScript(<number>tabs[0].id, {
                            code: `document.getElementsByTagName('video')[0].currentTime = videoPlayBackPosition;`,
                        });
                    }
                );
            }
        );
    }

    // スクロール位置を復元する
    function setScrollPosition(
        scrollPositionX: number,
        scrollPositionY: number
    ) {
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
                chrome.tabs.executeScript(
                    <number>tabs[0].id,
                    {
                        code: `
                const scrollPositionX = ${scrollPositionX}
                const scrollPositionY = ${scrollPositionY}
            `,
                    },
                    () => {
                        chrome.tabs.executeScript(<number>tabs[0].id, {
                            code: `
                    window.scrollTo(scrollPositionX, scrollPositionY);
                `,
                        });
                    }
                );
            }
        );
    }

    // 外部サービスログイン後、認証情報をストレージに保存する
    chrome.webRequest.onHeadersReceived.addListener(
        function (details) {
            const uid = details.responseHeaders?.find(
                (header) => header.name.toLowerCase() === 'uid'
            );
            const client = details.responseHeaders?.find(
                (header) => header.name.toLowerCase() === 'client'
            );
            const accessToken = details.responseHeaders?.find(
                (header) => header.name.toLowerCase() === 'access-token'
            );
            chrome.storage.sync.set({ uid: uid }, function () {
                console.log('uid saved');
            });
            chrome.storage.sync.set({ client: client }, function () {
                console.log('client saved');
            });
            chrome.storage.sync.set({ accessToken: accessToken }, function () {
                console.log('accessToken saved');
            });

            // 外部サービスログイン後、ログイン画面を閉じる
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    const regex =
                        /https:\/\/web-shiori.herokuapp.com\/v1\/auth\/.*\/callback/g;
                    if ((<string>tabs[0].url).match(regex)) {
                        chrome.tabs.remove(<number>tabs[0].id);
                    }
                }
            );
        },
        { urls: ['https://web-shiori.herokuapp.com/*'] },
        ['responseHeaders']
    );
}
