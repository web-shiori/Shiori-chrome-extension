module background {
    /**
     *  メッセージが送られてきたときの処理
     */
    // TODO: コンテンツを開く、というメッセージのときのみ動作するよう変更する
    chrome.runtime.onMessage.addListener((content: Content) => {
        setScrollPosition(
            content.scroll_position_x,
            content.scroll_position_y,
            content.max_scroll_position_x,
            content.max_scroll_position_y
        );
        setVideoPlayBackPosition(content.video_playback_position);
    });

    // 動画再生位置を復元する
    function setVideoPlayBackPosition(videoPlayBackPosition: number) {
        console.log('再生位置', videoPlayBackPosition);
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
                            code: `
                            const video = document.getElementsByTagName('video')[0];
                            video.addEventListener("loadeddata", function () { 
                                video.currentTime = videoPlayBackPosition;
                            })`,
                        });
                    }
                );
            }
        );
    }

    // スクロール位置を復元する
    function setScrollPosition(
        scrollPositionX: number,
        scrollPositionY: number,
        maxScrollPositionX: number,
        maxScrollPositionY: number
    ) {
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
                chrome.tabs.executeScript(
                    <number>tabs[0].id,
                    {
                        code: `
                    const scrollPositionX = ${scrollPositionX};
                    const scrollPositionY = ${scrollPositionY};
                    const maxScrollPositionX = ${maxScrollPositionX};
                    const maxScrollPositionY = ${maxScrollPositionY};
                    const scrollRateY = scrollPositionY / maxScrollPositionY
                `,
                    },
                    () => {
                        chrome.tabs.executeScript(
                            <number>tabs[0].id,
                            {
                                code: `
                                    const maxScrollPositionYOnChrome = document.documentElement.scrollHeight
                                    const ratedScrollPositionY = maxScrollPositionYOnChrome * scrollRateY
                                `,
                            },
                            () => {
                                chrome.tabs.executeScript(<number>tabs[0].id, {
                                    code: `window.scrollTo(0, ratedScrollPositionY);`,
                                });
                            }
                        );
                    }
                );
            }
        );
    }

    /**
     * 外部サービスログイン後、認証情報をストレージに保存する
     * chromeのHTTPリクエストを監視し、ログイン後のレスポンスヘッダから認証トークンを取得する
     * それをストレージに保存する
     */
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

            console.log('aaa');

            // 外部サービスログイン後、ログイン画面を閉じる
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.storage.sync.get(
                        ['uid', 'client', 'accessToken'],
                        function (value) {
                            if (
                                value.uid &&
                                value.client &&
                                value.accessToken
                            ) {
                                chrome.tabs.remove(<number>tabs[0].id);
                            }
                        }
                    );
                }
            );
        },
        { urls: ['https://web-shiori.herokuapp.com/v1/auth/*'] },
        ['responseHeaders']
    );
}
