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
        const videoPlayBackPositionPromise = getVideoPlayBackPosition();
        const scrollPositionXPromise = getScrollPositionX();
        const scrollPositionYPromise = getScrollPositionY();
        const maxScrollPositionXPromise = getMaxScrollPositionX();
        const maxScrollPositionYPromise = getMaxScrollPositionY();
        const thumbnailImgUrlPromise = getThumbnailImgUrl();
        const pdfScreenShotPromise = getPDFScreenShot();
        const [
            metaData,
            videoPlayBackPosition,
            scrollPositionX,
            scrollPositionY,
            maxScrollPositionX,
            maxScrollPositionY,
            thumbnailImgUrl,
            pdfScreenShot,
        ] = await Promise.all([
            metaDataPromise,
            videoPlayBackPositionPromise,
            scrollPositionXPromise,
            scrollPositionYPromise,
            maxScrollPositionXPromise,
            maxScrollPositionYPromise,
            thumbnailImgUrlPromise,
            pdfScreenShotPromise,
        ]);

        // TODO: エラー起きたときの処理も書く
        return new Promise((resolve) => {
            const postContent: PostContent = {
                title: metaData.title,
                url: metaData.url,
                thumbnail_img_url: thumbnailImgUrl,
                scroll_position_x: scrollPositionX,
                scroll_position_y: scrollPositionY,
                max_scroll_position_x: maxScrollPositionX,
                max_scroll_position_y: maxScrollPositionY,
                video_playback_position: videoPlayBackPosition,
                specified_text: null,
                specified_dom_id: null,
                specified_dom_class: null,
                specified_dom_tag: null,
                liked: null,
                pdf: pdfScreenShot,
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
                    const metaData: MetaData = {
                        title,
                        url,
                    };
                    resolve(metaData);
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

    // 現在開いているコンテンツの高さを取得する
    function getMaxScrollPositionX(): Promise<number> {
        // NOTE: 横方向のスクロールを保存したい人なんていないと思うので0を返す
        return new Promise((resolve) => {
            resolve(0);
        });
    }

    // 現在開いているコンテンツの幅を取得する
    function getMaxScrollPositionY(): Promise<number> {
        return new Promise<number>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `document.documentElement.scrollHeight;`,
                        },
                        (result) => {
                            const scrollPositionY: number = Number(result[0]);
                            resolve(scrollPositionY);
                        }
                    );
                }
            );
        });
    }

    // 現在開いているタブのコンテンツのスクロール位置(横)を取得する
    function getScrollPositionX(): Promise<number> {
        // NOTE: 横方向のスクロールを保存したい人なんていないと思うので0を返す
        return new Promise((resolve) => {
            resolve(0);
        });
    }

    // 現在開いているタブのコンテンツのスクロール位置(縦)を取得する
    function getScrollPositionY(): Promise<number> {
        return new Promise<number>((resolve) => {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                function (tabs) {
                    chrome.tabs.executeScript(
                        <number>tabs[0].id,
                        {
                            code: `document.documentElement.scrollTop;`,
                        },
                        (result) => {
                            const scrollPositionY: number = Number(result[0]);
                            resolve(scrollPositionY);
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
