module popup {
    /**
     * 認証関連のコード
     * 本当はリファクタリングしたいが、jsにトランスパイルした後でエラーが出るので暫定で個別に実装する
     * contentList/main.tsにも同じコードを定義している
     */
    export let currentUser: User | undefined = undefined;

    // currentUserにユーザをセットする
    export function setCurrentUser(): Promise<boolean> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(
                ['uid', 'client', 'accessToken'],
                function (value) {
                    if (value.uid && value.client && value.accessToken) {
                        currentUser = {
                            uid: value.uid.value,
                            client: value.client.value,
                            accessToken: value.accessToken.value,
                        };
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            );
        });
    }

    // ログイン画面を開く
    export function openSignInView() {
        chrome.windows.create({
            url: '../html/signIn.html',
            type: 'popup',
        });
    }

    /**
     * ポップアップのコード
     */
    const baseUrl: string = 'https://web-shiori.herokuapp.com';

    function post(path: string, header: HeadersInit, body: BodyInit) {
        const url = `${baseUrl}/${path}`;
        return fetch(url, {
            method: 'POST',
            headers: header,
            body: body,
        })
            .then(processResponse)
            .catch((error) => {
                console.error(error);
            });

        function processResponse(response: any) {
            if (!response.ok) {
                console.error('エラーレスポンス', response.json());
                // コンテンツ保存失敗画面表示
                const defaultPopup = document.getElementById('default-popup');
                const contentSaveFailedPopup = document.getElementById(
                    'content-save-failed-popup'
                );
                if (defaultPopup !== null) {
                    defaultPopup.style.display = 'none';
                }
                if (contentSaveFailedPopup !== null) {
                    contentSaveFailedPopup.style.display = 'block';
                }
            } else {
                // 保存完了画面表示
                const defaultPopup = document.getElementById('default-popup');
                const contentSavedPopup = document.getElementById(
                    'content-saved-popup'
                );
                if (defaultPopup !== null) {
                    defaultPopup.style.display = 'none';
                }
                if (contentSavedPopup !== null) {
                    contentSavedPopup.style.display = 'block';
                }
            }
        }
    }

    // 取得したコンテンツを保存する
    function doPostContent(content: PostContent) {
        const path = `v1/content`;
        const headers = {
            'Content-Type': 'application/json',
            'access-token': currentUser!.accessToken,
            client: currentUser!.client,
            uid: currentUser!.uid,
        };
        const body = JSON.stringify(content);
        post(path, headers, body);
    }

    function postPDF(content: PostContent) {
        const path = `v1/content`;
        const formData = new FormData();
        if (content.pdf != null) {
            formData.append('pdf', content.pdf);
        }
        formData.append('title', content.title);
        formData.append('url', content.url);
        const headers = {
            'access-token': currentUser!.accessToken,
            client: currentUser!.client,
            uid: currentUser!.uid,
        };
        post(path, headers, formData);
    }

    // 現在開いているタブのコンテンツを取得する
    async function getContent(): Promise<PostContent> {
        const metaDataPromise = getMetaData();
        const userAgentPromise = getUserAgent();
        const videoPlayBackPositionPromise = getVideoPlayBackPosition();
        const audioPlayBackPositionPromise = getAudioPlayBackPosition();
        const scrollPositionPromise = getScrollPosition();
        const maxScrollPositionPromise = getMaxScrollPosition();
        const thumbnailImgUrlPromise = getThumbnailImgUrl();
        const pdfScreenShotPromise = getPDFScreenShot();
        const windowSizePromise = getWindowSize();
        const offsetSizePromise = getOffsetSize();
        const [
            metaData,
            userAgent,
            videoPlayBackPosition,
            audioPlayBackPosition,
            scrollPosition,
            maxScrollPosition,
            thumbnailImgUrl,
            pdfScreenShot,
            windowSize,
            offsetSize,
        ] = await Promise.all([
            metaDataPromise,
            userAgentPromise,
            videoPlayBackPositionPromise,
            audioPlayBackPositionPromise,
            scrollPositionPromise,
            maxScrollPositionPromise,
            thumbnailImgUrlPromise,
            pdfScreenShotPromise,
            windowSizePromise,
            offsetSizePromise,
        ]);

        // TODO: エラー起きたときの処理も書く
        return new Promise((resolve) => {
            const postContent: PostContent = {
                title: metaData.title,
                url: metaData.url,
                device: metaData.device,
                browser: metaData.browser,
                user_agent: userAgent,
                thumbnail_img_url: thumbnailImgUrl,
                scroll_position_x: scrollPosition.x,
                scroll_position_y: scrollPosition.y,
                max_scroll_position_x: maxScrollPosition.x,
                max_scroll_position_y: maxScrollPosition.y,
                video_playback_position: videoPlayBackPosition,
                specified_text: null,
                specified_dom_id: null,
                specified_dom_class: null,
                specified_dom_tag: null,
                liked: false,
                pdf: pdfScreenShot,
                audio_playback_position: audioPlayBackPosition,
                window_inner_width: windowSize.innerWidth,
                window_inner_height: windowSize.innerHeight,
                window_outer_width: windowSize.outerWidth,
                window_outer_height: windowSize.outerHeight,
                offset_width: offsetSize.offsetWidth,
                offset_height: offsetSize.offsetHeight
            };
            resolve(postContent);
        });
    }

    // 現在開いているタブのメタデータ(title,url,height,width)を取得する
    function getMetaData() {
        return new Promise<MetaData>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    const title = tabs[0].title ?? '';
                    const url = tabs[0].url ?? '';
                    // NOTE: deviceは"PC"固定
                    const device = 'PC';
                    // NOTE: browserは"Chrome"固定
                    const browser = 'Chrome';
                    const metaData: MetaData = {
                        title,
                        url,
                        device,
                        browser,
                    };
                    resolve(metaData);
                }
            );
        });
    }

    // 現在開いているタブのUAを取得する
    function getUserAgent(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `navigator.userAgent;`,
                        },
                        (result) => {
                            resolve(result[0]);
                        }
                    );
                }
            );
        });
    }

    // 現在開いているタブの動画の再生位置を取得する
    function getVideoPlayBackPosition(): Promise<number> {
        return new Promise<number>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `document.getElementsByTagName('video')[0].currentTime;`,
                        },
                        (result) => {
                            const videoPlayBackPosition: number = Number(
                                result[0]
                            );
                            resolve(videoPlayBackPosition);
                        }
                    );
                }
            );
        });
    }

    // 現在開いているタブの音声の再生位置を取得する
    function getAudioPlayBackPosition(): Promise<number> {
        return new Promise<number>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `document.getElementsByTagName('audio')[0].currentTime;`,
                        },
                        (result) => {
                            const audioPlayBackPosition: number = Number(
                                result[0]
                            );
                            resolve(audioPlayBackPosition);
                        }
                    );
                }
            );
        });
    }

    interface MaxScrollPosition {
        x: number;
        y: number;
    }

    // 現在開いているコンテンツのサイズを取得する
    function getMaxScrollPosition(): Promise<MaxScrollPosition> {
        return new Promise<MaxScrollPosition>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `
                            var x = document.documentElement.scrollWidth;
                            var y = document.documentElement.scrollHeight;
                            var result = [x, y];
                            result;
                            `,
                        },
                        (result) => {
                            const scrollPositionX: number = Number(
                                result[0][0]
                            );
                            const scrollPositionY: number = Number(
                                result[0][1]
                            );
                            const maxScrollPosition: MaxScrollPosition = {
                                x: scrollPositionX,
                                y: scrollPositionY,
                            };
                            resolve(maxScrollPosition);
                        }
                    );
                }
            );
        });
    }

    interface ScrollPosition {
        x: number;
        y: number;
    }

    // 現在開いているタブのスクロール位置を取得する
    function getScrollPosition(): Promise<ScrollPosition> {
        return new Promise<ScrollPosition>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `
                                var x = document.documentElement.scrollLeft;
                                var y = document.documentElement.scrollTop;
                                var result = [x, y];
                                result;
                            `,
                        },
                        (result) => {
                            const scrollPositionX: number = Number(
                                result[0][0]
                            );
                            const scrollPositionY: number = Number(
                                result[0][1]
                            );
                            const scrollPosition: ScrollPosition = {
                                x: scrollPositionX,
                                y: scrollPositionY,
                            };
                            resolve(scrollPosition);
                        }
                    );
                }
            );
        });
    }

    // 現在開いているタブのコンテンツのサムネイル画像を取得する
    function getThumbnailImgUrl(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    // NOTE: youtubeのサムネイルは特殊なので個別対応
                    const url = tabs[0].url;
                    if (url?.includes('https://www.youtube.com/')) {
                        // youtubeのvideo-idを取得
                        let videoId = url.split('v=')[1];
                        const ampersandPosition = videoId.indexOf('&');
                        // video-idの&=以降を削除
                        if (ampersandPosition != -1) {
                            videoId = videoId.substring(0, ampersandPosition);
                        }
                        const thumbnailImgURL = `http://img.youtube.com/vi/${videoId}/0.jpg`;
                        resolve(thumbnailImgURL);
                    }
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            // body内で一番サイズの大きい画像をサムネイル画像とする
                            code: `
                                var largest = 0;
                                var largestImg; 
                                Array.from(document.body.getElementsByTagName('img')).forEach(function(e) { 
                                    if (largest < e.height) {
                                        largestImg = e;largest = e.height
                                    }
                                });
                                largestImg.src
                            `,
                        },
                        (result) => {
                            const thumbnailImgUrl: string = String(result[0]);
                            resolve(thumbnailImgUrl);
                        }
                    );
                }
            );
        });
    }

    // TODO: 別ファイルに切り出したい.
    // PDFのスクリーンショット(File型)を返す. PDF出ない場合はnilを返す.
    async function getPDFScreenShot(): Promise<File | null> {
        return new Promise<File | null>((resolve) => {
            isPDF()
                .then((isPDF) => {
                    if (isPDF) {
                        resolve(captureScreenShot());
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    // PDFかどうかを判定する.
    function isPDF(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    const urlStr = tabs[0].url ?? '';
                    const url = new URL(urlStr);
                    const pdfRegex = new RegExp('\\.pdf');
                    resolve(pdfRegex.test(url.pathname));
                }
            );
        });
    }

    // PDFのスクリーンショットを撮影する.
    function captureScreenShot(): Promise<File | null> {
        return new Promise<File | null>((resolve) => {
            chrome.windows.getCurrent(
                { populate: true },
                function (currentWindow) {
                    if (currentWindow.id != null) {
                        chrome.tabs.captureVisibleTab(
                            currentWindow.id,
                            { format: 'png' },
                            (image) => {
                                const f = conversionBase64ToFile(image);
                                resolve(f);
                            }
                        );
                    }
                }
            );
        });
    }

    // base64エンコードをFileに変換する
    function conversionBase64ToFile(image: string): File {
        const blob = atob(image.replace(/^.*,/, ''));
        let buffer = new Uint8Array(blob.length);
        for (let i = 0; i < blob.length; i++) {
            buffer[i] = blob.charCodeAt(i);
        }
        const f = new File([buffer.buffer], 'screenshot.png', {
            type: 'file',
        });
        return f;
    }

    interface WindowSize {
        innerWidth: number;
        innerHeight: number;
        outerWidth: number;
        outerHeight: number;
    }

    // ウィンドウサイズを取得
    function getWindowSize(): Promise<WindowSize> {
        return new Promise<WindowSize>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `
                                var iw = window.innerWidth;
                                var ih = window.innerHeight;
                                var ow = window.outerWidth;
                                var oh = window.outerHeight;
                                var result = [iw, ih, ow, oh];
                                result;
                            `,
                        },
                        (result) => {
                            let windowSize: WindowSize = {
                                innerWidth: Number(result[0][0]),
                                innerHeight: Number(result[0][1]),
                                outerWidth: Number(result[0][2]),
                                outerHeight: Number(result[0][3]),
                            };
                            resolve(windowSize);
                        }
                    );
                }
            );
        });
    }

    interface OffsetSize {
        offsetWidth: number
        offsetHeight: number
    }

    // offsetWidth/Heightを取得
    function getOffsetSize(): Promise<OffsetSize> {
        return new Promise<OffsetSize>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `
                                var ow = document.documentElement.offsetWidth;
                                var oh = document.documentElement.offsetHeight;
                                var result = [ow, oh];
                                result;
                            `,
                        },
                        (result) => {
                            let offsetSize: OffsetSize = {
                                offsetWidth: Number(result[0][0]),
                                offsetHeight: Number(result[0][1]),
                            };
                            resolve(offsetSize);
                        }
                    );
                }
            );
        });
    }

    // `保存する`ボタンをクリックしたときの処理
    const saveButton = document.getElementById('save-button');
    if (saveButton !== null) {
        getPDFScreenShot();

        saveButton.addEventListener('click', async function () {
            // 保存中インジケータ表示
            saveButton.innerHTML = `
            <div class="spinner-border spinner-border-sm" role="status" id="content-save-indicator">
                <span class="sr-only">Loading...</span>
            </div>
            `;

            getWindowSize();

            getContent()
                .then((content) => {
                    if (content.pdf != null) {
                        postPDF(content);
                    } else {
                        doPostContent(content);
                    }
                })
                .catch((error) => {
                    console.error('エラー', error);
                });
        });
    }

    // `コンテンツ一覧`ボタンをクリックしたときの処理
    const showContentListViewButton = document.getElementById(
        'show-content-list-view-button'
    );
    if (showContentListViewButton !== null) {
        showContentListViewButton.addEventListener('click', function () {
            chrome.tabs.create({ url: '../html/contentList.html' });
        });
    }

    // ⚙ボタンをクリックしたときの処理
    const showOptionViewButton = document.getElementById(
        'show-option-view-button'
    );
    if (showOptionViewButton !== null) {
        showOptionViewButton.addEventListener('click', function () {
            chrome.tabs.create({ url: '../html/options.html' });
        });
    }
}
