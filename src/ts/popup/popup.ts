module popup {
	// 現在開いているタブのコンテンツを取得する
    async function getContent(): Promise<PostContent> {
        const metaDataPromise = getMetaData()
        const videoPlayBackPositionPromise = getVideoPlayBackPosition()
        const scrollPositionXPromise = getScrollPositionX()
        const scrollPositionYPromise = getScrollPositionY()
        const [metaData, videoPlayBackPosition, scrollPositionX, scrollPositionY] = await Promise.all(
            [metaDataPromise, videoPlayBackPositionPromise, scrollPositionXPromise, scrollPositionYPromise]
        )

        	// TODO: エラー起きたときの処理も書く
        return new Promise((resolve => {
            const postContent: PostContent = {
                title: metaData.title,
                url: metaData.url,
                scroll_position_x: scrollPositionX,
                scroll_position_y: scrollPositionY,
                max_scroll_position_x: metaData.max_scroll_position_x,
                max_scroll_position_y: metaData.max_scroll_position_y,
                video_playback_position: videoPlayBackPosition,
                specified_text: null,
                specified_dom_id: null,
                specified_dom_class: null,
                specified_dom_tag: null
            }
            resolve(postContent)
        }))
    }

	// 現在開いているタブのメタデータ(title,url,height,width)を取得する
    function getMetaData() {
        return new Promise<MetaData>((resolve) => {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                const title = tabs[0].title ?? ""
                const url = tabs[0].url ?? "a"
                const max_scroll_position_x = tabs[0].width ?? 0
                const max_scroll_position_y = tabs[0].height ?? 0
                const metaData: MetaData = {
                    title,
                    url,
                    max_scroll_position_x,
                    max_scroll_position_y
                }
                resolve(metaData)
            })
        })
    }

	// 現在開いているタブの動画の再生位置を取得する
    function getVideoPlayBackPosition(): Promise<number> {
        return new Promise<number>((resolve) => {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                chrome.tabs.executeScript(<number>tabs[0].id, {
                    code: `document.getElementsByTagName('video')[0].currentTime;`
                }, (result) => {
                    const videoPlayBackPosition: number = Number(result[0])
                    resolve(videoPlayBackPosition)
                })
            })
        })
    }

	// 現在開いているタブのコンテンツのスクロール位置(横)を取得する
    function getScrollPositionX(): Promise<number> {
        	// NOTE: 横方向のスクロールを保存したい人なんていないと思うので0を返す
        return new Promise((resolve => {
            resolve(0)
        }))
    }

	// 現在開いているタブのコンテンツのスクロール位置(横)を取得する
    function getScrollPositionY(): Promise<number> {
        return new Promise<number>((resolve) => {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                chrome.tabs.executeScript(<number>tabs[0].id, {
                    code: `Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);`
                }, (result) => {
                    const scrollPositionY: number = Number(result[0])
                    resolve(scrollPositionY)
                })
            })
        })
    }

	// 取得したコンテンツを保存する
    function doPostContent(content: PostContent) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content`
        fetch(url, {
            method: 'POST',
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            },
            body: JSON.stringify(content)
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            } else {
                // 保存完了画面表示
                const defaultPopup = document.getElementById("default-popup");
                const contentSavedPopup = document.getElementById("content-saved-popup");
                if (defaultPopup !== null) {
                    defaultPopup.style.display = "none"
                }
                if (contentSavedPopup !== null) {
                    contentSavedPopup.style.display = "block"
                }
            }
        }
    }

	// `保存する`ボタンをクリックしたときの処理
    const saveButton = document.getElementById("save-button");
    if (saveButton !== null) {
        saveButton.addEventListener('click', async function () {
            getContent().then(content => {
                doPostContent(content)
            }).catch((error) => {
                console.error("エラー", error)
            })
        })
    }

	// `コンテンツ一覧`ボタンをクリックしたときの処理
    const showContentListViewButton = document.getElementById("show-content-list-view-button")
    if (showContentListViewButton !== null) {
        showContentListViewButton.addEventListener('click', function () {
            chrome.tabs.create({url: '../html/contentList.html'})
        })
    }

	// ⚙ボタンをクリックしたときの処理
    const showOptionViewButton = document.getElementById("show-option-view-button")
    if (showOptionViewButton !== null) {
        showOptionViewButton.addEventListener('click', function () {
            chrome.tabs.create({url: '../html/options.html'})
        })
    }
}
