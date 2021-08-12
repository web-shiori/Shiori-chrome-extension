interface content {
    title: string
    url: string
    thumbnail_img_url: string
    registered_at: string
    scroll_position_x: number
    scroll_position_y: number
    max_scroll_position_x: number
    max_scroll_position_y: number
    video_playback_position: number
}

const content_1: content = {
    title: "title",
    url: "https://www.youtube.com/watch?v=pBtcTIDsS24&ab_channel=AbleNet",
    thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
    registered_at: "2019-05-12T20:48:24.000+09:00",
    scroll_position_x: 0,
    scroll_position_y: 500,
    max_scroll_position_x: 1000,
    max_scroll_position_y: 1000,
    video_playback_position: 500,
}

//TODO: サムネイルをurlから取得する
//TODO: 登録日を加工する
const view = `
<h4>保存済みのコンテンツ</h4>
<div>
<img src="${content_1.thumbnail_img_url}" height="50px" width="50px">
<h6>${content_1.title}</h6>
<h6>${content_1.url}</h6>
<h6>${content_1.registered_at}</h6>
</div>
`;

const content_list_view = document.getElementById("content-list-view");
if (content_list_view !== null) {
    content_list_view.innerHTML = view;
} else {
    alert(document.documentElement.innerHTML)
}


