// TODO: デフォルトのサムネイルurlを定数で持っておく

let contentList: Content[] = []

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
                // TODO: JSONにバリデーションをかけたい(参考: https://zenn.dev/uzimaru0000/articles/json-type-validation)
                contentList = contentListJson.data.content
            });
        }
    }
}


// コンテンツviewを生成する
function generateContentView() {
    let contentViewTl = `
    <h4>保存済みのコンテンツ</h4>
    <hr>
    `

    for (const content of contentList) {
        //TODO: サムネイルをurlから取得する
        //TODO: 登録日を加工する
        const viewTl = `
        <div class="content-view">
        <img src="${content.thumbnail_img_url}" height="50px" width="50px">
        <h6>${content.title}</h6>
        <h6>${content.url}</h6>
        <h6>${content.updated_at}</h6>
        </div>
        <hr>
        `
        contentViewTl += viewTl
    }
    return contentViewTl
}

// コンテンツのviewを表示する
function drawContentView(contentViewTl: string) {
    const contentListView = document.getElementById("content-list-view");
    if (contentListView !== null) {
        contentListView.innerHTML = contentViewTl;
    }
}

// コンテンツにイベントを登録する
function addEventToContentView() {
    const contentView = document.getElementsByClassName('content-view');
    for(let i = 0; i < contentView.length; i++) {
        contentView[i].addEventListener("click", function (){
            openContent(i)
        }, false)
    }
}

// コンテンツを新しいタブで開く
async function openContent(index: number) {
    const targetContent: Content = contentList[index]
    const url: string = targetContent.url
    await chrome.tabs.create({ url })
    chrome.runtime.sendMessage(targetContent)
}

// ポップアップviewにコンテンツを表示する
async function initializeContent() {
    // NOTE: 表示にちょっと時間がかかる(仕方ない？)
    await fetchContentList()
    const contentViewTl = await generateContentView()
    await drawContentView(contentViewTl)
    addEventToContentView()
}

initializeContent()
