// メッセージが送られてきたときの処理
chrome.runtime.onMessage.addListener((content: content) => {
    setScrollPosition(content.scroll_position_x, content.scroll_position_y)
    setVideoPlayBackPosition(content.video_playback_position)
})

// TODO: loadedmetadataイベントが発生した後に再生位置を設定する
function setVideoPlayBackPosition(videoPlayBackPosition: number) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        chrome.tabs.executeScript(<number>tabs[0].id, {
            code: `const videoPlayBackPosition = ` + videoPlayBackPosition
        },() => {
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
        },() => {
            chrome.tabs.executeScript(<number>tabs[0].id, {
                code: `
                    window.scrollTo(scrollPositionX, scrollPositionY);
                `
            })
        })
    })
}
