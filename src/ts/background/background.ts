module background {
    /**
     *  メッセージが送られてきたときの処理
     */
    // TODO: コンテンツを開く、というメッセージのときのみ動作するよう変更する
    chrome.runtime.onMessage.addListener((content: Content) => {
        restoreScrollPosition(content);
        if (content.video_playback_position != null) {
            setVideoPlayBackPosition(content.video_playback_position);
        }
        if (content.audio_playback_position != null) {
            setAudioPlayBackPosition(content.audio_playback_position);
        }
    });

    async function restoreScrollPosition(content: Content) {
        // if (
        //     content.window_outer_width != null &&
        //     content.window_outer_height != null
        // ) {
        //     await restoreWindowSize(
        //         content.window_outer_width,
        //         content.window_outer_height
        //     );
        // }
        if (content.offset_width != null && content.offset_height != null) {
            await setBodyWidth(content.offset_width, content.offset_height)
        }
        setScrollPosition(content.scroll_position_x, content.scroll_position_y);
    }

    /*
        不要だけど念の為残しておく。
     */

    // 保存時のウィンドウサイズを復元する
    // async function restoreWindowSize(windowWidth: number, windowHeight: number) {
    //     const currentWindowSize = await getWindowSize()
    //     if (currentWindowSize.outerWidth == windowWidth && currentWindowSize.outerHeight == windowHeight) {
    //         return
    //     }
    //     const info = {
    //         width: windowWidth,
    //         height: windowHeight,
    //     };
    //     chrome.windows.getCurrent({populate: true}, function (currentWindow) {
    //         if (currentWindow.id != null) {
    //             // @ts-ignore
    //             chrome.windows.update(currentWindow.id, info);
    //         }
    //     });
    // }

    // interface WindowSize {
    //     innerWidth: number;
    //     innerHeight: number;
    //     outerWidth: number;
    //     outerHeight: number;
    // }

    // // ウィンドウサイズを取得
    // function getWindowSize(): Promise<WindowSize> {
    //     return new Promise<WindowSize>((resolve) => {
    //         chrome.tabs.query(
    //             { active: true, lastFocusedWindow: true },
    //             function (tabs) {
    //                 chrome.tabs.executeScript(
    //                     <number>tabs[0].id,
    //                     {
    //                         code: `
    //                             var iw = window.innerWidth;
    //                             var ih = window.innerHeight;
    //                             var ow = window.outerWidth;
    //                             var oh = window.outerHeight;
    //                             var result = [iw, ih, ow, oh];
    //                             result;
    //                         `,
    //                     },
    //                     (result) => {
    //                         let windowSize: WindowSize = {
    //                             innerWidth: Number(result[0][0]),
    //                             innerHeight: Number(result[0][1]),
    //                             outerWidth: Number(result[0][2]),
    //                             outerHeight: Number(result[0][3]),
    //                         };
    //                         resolve(windowSize);
    //                     }
    //                 );
    //             }
    //         );
    //     });
    // }

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
                            let video = document.getElementsByTagName('video')[0];
                            if (video) {
                                video.currentTime = videoPlayBackPosition;
                                video.addEventListener("loadeddata", function () {
                                    video.currentTime = videoPlayBackPosition;
                                })
                            }
                            `,
                        });
                    }
                );
            }
        );
    }

    // 音声再生位置を復元する
    function setAudioPlayBackPosition(audioPlayBackPosition: number) {
        console.log('音声再生位置', audioPlayBackPosition);
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
                chrome.tabs.executeScript(
                    <number>tabs[0].id,
                    {
                        code:
                            `const audioPlayBackPosition = ` +
                            audioPlayBackPosition,
                    },
                    () => {
                        chrome.tabs.executeScript(<number>tabs[0].id, {
                            code: `
                            let audio = document.getElementsByTagName('audio')[0];
                            if (audio) {
                                audio.currentTime = audioPlayBackPosition;
                                audio.addEventListener("loadeddata", function () { 
                                    audio.currentTime = audioPlayBackPosition;
                                })
                            }
                            `,
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
        console.log('スクロール位置', scrollPositionY);
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
                chrome.tabs.executeScript(
                    <number>tabs[0].id,
                    {
                        code: `
                    const scrollPositionX = ${scrollPositionX};
                    const scrollPositionY = ${scrollPositionY};
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

    // bodyの表示領域を変える
    function setBodyWidth(innerWidth: number, innerHeight: number) {
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            function (tabs) {
                chrome.tabs.executeScript(
                    <number>tabs[0].id,
                    {
                        code: `
                    let innerWidth = '${innerWidth}px';
                    let innerHeight = '${innerHeight}px';
                `,
                    },
                    () => {
                        chrome.tabs.executeScript(<number>tabs[0].id, {
                            code: `
                                    document.body.style.width = innerWidth;
                                `,
                        });
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
