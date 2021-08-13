// `保存する`ボタンをクリックしたときの処理
const saveButton = document.getElementById("save-button");
if (saveButton !== null) {
    saveButton.addEventListener('click', async function () {
        getContent().then(content => {
            saveContent(content)
        }).catch((error) => {
            console.error("エラー", error)
        })
    })
}

// 現在開いているタブのコンテンツを取得する
async function getContent(): Promise<postContent> {
    console.log("getContentFronCurrentTab")
    const metaDataPromise = getMetaData()
    const videoPlayBackPositionPromise = getVideoPlayBackPosition()
    const scrollPositionXPromise = getScrollPositionX()
    const scrollPositionYPromise = getScrollPositionY()
    const [metaData, videoPlayBackPosition, scrollPositionX, scrollPositionY] = await Promise.all(
        [metaDataPromise, videoPlayBackPositionPromise, scrollPositionXPromise, scrollPositionYPromise]
    )

    // TODO: エラー起きたときの処理も書く
    return new Promise((resolve => {
        const postContent: postContent = {
            title: metaData.title,
            url: metaData.url,
            scroll_position_x: scrollPositionX,
            scroll_position_y: scrollPositionY,
            max_scroll_position_x: metaData.width,
            max_scroll_position_y: metaData.height,
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
    // TODO: metaDataインターフェイスを定義する
    return new Promise<{ title: string, url: string, height: number, width: number }>((resolve) => {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            const title = tabs[0].title ?? ""
            const url = tabs[0].url ?? "a"
            const height: number = tabs[0].height ?? 0
            const width = tabs[0].width ?? 0
            resolve({ title, url, height, width })
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
function saveContent(content: postContent) {
    alert(content.url)
}
