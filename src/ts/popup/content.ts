// TODO: デフォルトのサムネイルurlを定数で持っておく

let content_list: content[] = []

// コンテンツ一覧を取得する(上限5個)
function fetchContentList() {
    const limit = 5
    // TODO: URLを本番APIに修正する
    return fetch(`https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content?limit=${limit}`, {
        headers: {
            'access-token': 'access-token',
            'client': 'client',
            'uid': 'uid'
        }
    }).then(processFetchedResponse).catch(error => {
        console.error(error);
    });

    function processFetchedResponse(response: any) {
        if (!response.ok) {
            // TODO: エラー時の処理を実装する
            console.error("エラーレスポンス", response);
        } else {
            return response.json().then((contentListJson: any) => {
                content_list = contentListJson.data.content
            });
        }
    }
}


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
        <h6>${content.updated_at}</h6>
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
    await chrome.tabs.create({ url })
    chrome.runtime.sendMessage(targetContent)
}

// ポップアップviewにコンテンツを表示する
async function initialize_content() {
    await fetchContentList()
    const content_view_tl = await generateContentView()
    await drawContentView(content_view_tl)
    addEventToContentView()
}

initialize_content()
