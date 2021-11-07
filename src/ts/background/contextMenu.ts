module background {
    /**
     * 認証関連のコード
     * 本当はリファクタリングしたいが、jsにトランスパイルした後でエラーが出るので暫定で個別に実装する
     * バックグラウンドだけに定義して、chrome.runtime.getBackgroundPage().currentUserでアクセスできると本には書いてあるけど、できない
     * contentListとpopupにも同じコードを定義している
     */
    // let currentUser: User | undefined = undefined;
    //
    // // currentUserにユーザをセットする
    // function setCurrentUser(): Promise<boolean> {
    //     return new Promise((resolve) => {
    //         chrome.storage.sync.get(
    //             ['uid', 'client', 'accessToken'],
    //             function (value) {
    //                 if (value.uid && value.client && value.accessToken) {
    //                     currentUser = {
    //                         uid: value.uid.value,
    //                         client: value.client.value,
    //                         accessToken: value.accessToken.value,
    //                     };
    //                     resolve(true);
    //                 } else {
    //                     resolve(false);
    //                 }
    //             }
    //         );
    //     });
    // }
    //
    // /**
    //  * コンテンツを保存するためのコード
    //  * popup/popup.tsとほとんど同じコード。ただここに書かないとバックグラウンドで実行できないのでここにも書く
    //  */
    // const baseUrl: string = 'https://web-shiori.herokuapp.com';
    //
    // // 取得したコンテンツを保存する
    // function doPostContent(content: PostContent) {
    //     const url = `${baseUrl}/v1/content`;
    //     return fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'access-token': currentUser!.accessToken,
    //             client: currentUser!.client,
    //             uid: currentUser!.uid,
    //         },
    //         body: JSON.stringify(content),
    //     })
    //         .then(processResponse)
    //         .catch((error) => {
    //             console.error(error);
    //         });
    //
    //     function processResponse(response: any) {
    //         if (!response.ok) {
    //             console.error('エラーレスポンス', response.json());
    //         } else {
    //             // TODO: 保存完了時に選択したテキストをハイライトする
    //         }
    //     }
    // }
    //
    // // 現在開いているタブのコンテンツを取得する
    // async function getContent(): Promise<PostContent> {
    //     const metaDataPromise = getMetaData();
    //     const videoPlayBackPositionPromise = getVideoPlayBackPosition();
    //     const thumbnailImgUrlPromise = getThumbnailImgUrl();
    //     const [metaData, videoPlayBackPosition, thumbnailImgUrl] =
    //         await Promise.all([
    //             metaDataPromise,
    //             videoPlayBackPositionPromise,
    //             thumbnailImgUrlPromise,
    //         ]);
    //
    //     // TODO: エラー起きたときの処理も書く
    //     return new Promise((resolve) => {
    //         const postContent: PostContent = {
    //             title: metaData.title,
    //             url: metaData.url,
    //             thumbnail_img_url: thumbnailImgUrl,
    //             scroll_position_x: 0,
    //             scroll_position_y: 0,
    //             max_scroll_position_x: 0,
    //             max_scroll_position_y: 0,
    //             video_playback_position: videoPlayBackPosition,
    //             specified_text: null,
    //             specified_dom_id: null,
    //             specified_dom_class: null,
    //             specified_dom_tag: null,
    //             liked: null,
    //         };
    //         resolve(postContent);
    //     });
    // }
    //
    // // 現在開いているタブのメタデータ(title,url,height,width)を取得する
    // function getMetaData() {
    //     return new Promise<MetaData>((resolve) => {
    //         chrome.tabs.query(
    //             { active: true, lastFocusedWindow: true },
    //             function (tabs) {
    //                 const title = tabs[0].title ?? '';
    //                 const url = tabs[0].url ?? 'a';
    //                 const metaData: MetaData = {
    //                     title,
    //                     url,
    //                 };
    //                 resolve(metaData);
    //             }
    //         );
    //     });
    // }
    //
    // // 現在開いているタブの動画の再生位置を取得する
    // function getVideoPlayBackPosition(): Promise<number> {
    //     return new Promise<number>((resolve) => {
    //         chrome.tabs.query(
    //             { active: true, lastFocusedWindow: true },
    //             function (tabs) {
    //                 chrome.tabs.executeScript(
    //                     <number>tabs[0].id,
    //                     {
    //                         code: `document.getElementsByTagName('video')[0].currentTime;`,
    //                     },
    //                     (result) => {
    //                         const videoPlayBackPosition: number = Number(
    //                             result[0]
    //                         );
    //                         resolve(videoPlayBackPosition);
    //                     }
    //                 );
    //             }
    //         );
    //     });
    // }
    //
    // // 現在開いているタブのコンテンツのサムネイル画像を取得する
    // function getThumbnailImgUrl(): Promise<string> {
    //     return new Promise<string>((resolve) => {
    //         chrome.tabs.query(
    //             { active: true, lastFocusedWindow: true },
    //             function (tabs) {
    //                 // NOTE: youtubeのサムネイルは特殊なので個別対応
    //                 const url = tabs[0].url;
    //                 if (url?.includes('https://www.youtube.com/')) {
    //                     // youtubeのvideo-idを取得
    //                     let videoId = url.split('v=')[1];
    //                     const ampersandPosition = videoId.indexOf('&');
    //                     // video-idの&=以降を削除
    //                     if (ampersandPosition != -1) {
    //                         videoId = videoId.substring(0, ampersandPosition);
    //                     }
    //                     const thumbnailImgURL = `http://img.youtube.com/vi/${videoId}/0.jpg`;
    //                     resolve(thumbnailImgURL);
    //                 }
    //                 chrome.tabs.executeScript(
    //                     <number>tabs[0].id,
    //                     {
    //                         // body内で一番サイズの大きい画像をサムネイル画像とする
    //                         code: `
    //                             var largest = 0;
    //                             var largestImg;
    //                             Array.from(document.body.getElementsByTagName('img')).forEach(function(e) {
    //                                 if (largest < e.height) {
    //                                     largestImg = e;largest = e.height
    //                                 }
    //                             });
    //                             largestImg.src
    //                         `,
    //                     },
    //                     (result) => {
    //                         const thumbnailImgUrl: string = String(result[0]);
    //                         resolve(thumbnailImgUrl);
    //                     }
    //                 );
    //             }
    //         );
    //     });
    // }

    var id = 100;
    function pdf() {
        chrome.tabs.captureVisibleTab(function (screenshotUrl) {
            // @ts-ignore
            var viewTabUrl = chrome.extension.getURL(
                'screenshot.html?id=',
                // @ts-ignore
                +id++
            );

            // @ts-ignore
            var targetId = null;

            chrome.tabs.onUpdated.addListener(function listener(
                tabId,
                changedProps
            ) {
                // We are waiting for the tab we opened to finish loading.
                // Check that the tab's id matches the tab we opened,
                // and that the tab is done loading.
                // @ts-ignore
                if (tabId != targetId || changedProps.status != 'complete')
                    return;

                // Passing the above test means this is the event we were waiting for.
                // There is nothing we need to do for future onUpdated events, so we
                // use removeListner to stop getting called when onUpdated events fire.
                chrome.tabs.onUpdated.removeListener(listener);

                // Look through all views to find the window which will display
                // the screenshot.  The url of the tab which will display the
                // screenshot includes a query parameter with a unique id, which
                // ensures that exactly one view will have the matching URL.
                var views = chrome.extension.getViews();
                for (var i = 0; i < views.length; i++) {
                    var view = views[i];
                    if (view.location.href == viewTabUrl) {
                        setScreenshotUrl(screenshotUrl);
                        break;
                    }
                }
            });

            chrome.tabs.create({ url: viewTabUrl }, function (tab) {
                targetId = tab.id;
            });
        });
    }

    // @ts-ignore
    function setScreenshotUrl(url) {
        // @ts-ignore
        document.getElementById('target').src = url;
    }

    /**
     * コンテキストメニュー
     * NOTE: うまく動作していないので一旦消す
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

    // PDF実験用: 子メニュー3追加
    chrome.contextMenus.create({
        id: 'child3',
        title: 'PDF',
        contexts: ['all'],
        parentId: parentId,
    });

    // コンテキストメニュークリック時の処理
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (tab === undefined) return;
        chrome.tabs.sendMessage(
            <number>tab.id,
            { method: 'getSelection' },
            (response) => {
                if (info.menuItemId === 'child1') {
                    // getContent()
                    //     .then((content) => {
                    //         content.specified_text = response.data;
                    //         doPostContent(content);
                    //     })
                    //     .catch((error) => {
                    //         console.error('エラー', error);
                    //     });
                } else if (info.menuItemId === 'child2') {
                    // // 子メニュー2をクリックしたときの処理
                    // // 選択されたテキストへのリンクを生成
                    // // NOTE: これだと対応できないパターンがたくさんある。けど大変そうなので暫定で以下のまま
                    // const urlWithSpecifiedText = encodeURI(
                    //     info.pageUrl + '#:~:text=' + response.data
                    // );
                    // saveToClipboard(urlWithSpecifiedText);
                } else if (info.menuItemId === 'child3') {
                    console.log(response);
                    pdf();
                }
            }
        );
    });
    //
    // // 文字列をクリップボードにコピーする
    // function saveToClipboard(str: string | undefined) {
    //     const textArea = document.createElement('textarea');
    //     document.body.appendChild(textArea);
    //     textArea.value = str ?? '';
    //     textArea.select();
    //     document.execCommand('copy');
    //     document.body.removeChild(textArea);
    // }

    function main() {
        // setCurrentUser();
    }

    main();
}
