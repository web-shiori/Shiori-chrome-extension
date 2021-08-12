// TODO: デフォルトのサムネイルurlを定数で持っておく

const content_1: content = {
    title: "title1",
    url: "https://www.youtube.com/watch?v=pBtcTIDsS24&ab_channel=AbleNet",
    thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
    registered_at: "2019-05-12T20:48:24.000+09:00",
    scroll_position_x: 0,
    scroll_position_y: 500,
    max_scroll_position_x: 1000,
    max_scroll_position_y: 1000,
    video_playback_position: 50,
}

const content_2: content = {
    title: "title2",
    url: "https://www.youtube.com/watch?v=pBtcTIDsS24&ab_channel=AbleNet",
    thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
    registered_at: "2019-05-12T20:48:24.000+09:00",
    scroll_position_x: 0,
    scroll_position_y: 500,
    max_scroll_position_x: 1000,
    max_scroll_position_y: 1000,
    video_playback_position: 100,
}
const content_list = [content_1, content_2]

// コンテンツviewを生成する
function generateContentView() {
    let content_view_tl = `
    <h4>保存済みのコンテンツ</h4>
    <hr>
    `

    for (const content of content_list) {
        //TODO: サムネイルをurlから取得する
        //TODO: 登録日を加工する
        const view_tl = `
        <div class="content-view">
        <img src="${content.thumbnail_img_url}" height="50px" width="50px">
        <h6>${content.title}</h6>
        <h6>${content.url}</h6>
        <h6>${content.registered_at}</h6>
        </div>
        <hr>
        `
        content_view_tl += view_tl
    }
    return content_view_tl
}

// コンテンツのviewを表示する
function drawContentView(content_view_tl: string) {
    const content_list_view = document.getElementById("content-list-view");
    if (content_list_view !== null) {
        content_list_view.innerHTML = content_view_tl;
    }
}

// コンテンツにイベントを登録する
function addEventToContentView() {
    const content_view = document.getElementsByClassName('content-view');
    for(let i = 0; i < content_view.length; i++) {
        content_view[i].addEventListener("click", function (){
            open_content(i)
        }, false)
    }
}

// コンテンツを新しいタブで開く
async function open_content(index: number) {
    const targetContent: content = content_list[index]
    const url: string = targetContent.url
    // 新しいタブを開く
    await chrome.tabs.create({ url })
    // メッセージを送る
    chrome.runtime.sendMessage(targetContent)
}

// ポップアップviewにコンテンツを表示する
async function initialize_content() {
    const content_view_tl = generateContentView()
    await drawContentView(content_view_tl)
    addEventToContentView()
}

initialize_content()
