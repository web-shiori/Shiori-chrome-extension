module contentList {
    let contentList: Content[] = []

    // コンテンツ一覧を取得する
    // function fetchContentList() {
    //     // TODO: URLを本番APIに修正する
    //     return fetch(`https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content`, {
    //         headers: {
    //             'access-token': 'access-token',
    //             'client': 'client',
    //             'uid': 'uid'
    //         }
    //     }).then(processFetchedResponse).catch(error => {
    //         console.error(error)
    //     })
    //
    //     function processFetchedResponse(response: any) {
    //         if (!response.ok) {
    //             // TODO: エラー時の処理を実装する
    //             console.error("エラーレスポンス", response)
    //         } else {
    //             return response.json().then((contentListJson: any) => {
    //                 // TODO: JSONにバリデーションをかけたい(参考: https://zenn.dev/uzimaru0000/articles/json-type-validation)
    //                 contentList = contentListJson.data.content
    //             })
    //         }
    //     }
    // }

    // 動作確認用コンテンツ一覧取得
    function dummyFetchContentList() {
        const content1: Content = {
            content_id: 0,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: false,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https:	//i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https:	//www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content2: Content = {
            content_id: 0,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: false,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 500,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https:	//gyazo.com/f149c85d239c13b76388822357755672/thumb/400",
            title: "アイデア",
            type: "",
            updated_at: "2020-05-12T20:48:24.000+09:00",
            url: "https:	//qiita.com/MasatoraAtarashi/items/eec4642fe1e6ce79304d",
            video_playback_position: 0
        }

        const content3: Content = {
            content_id: 0,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: false,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 500,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https:	//hayabusa.io/ca/files/topics/26111_ext_24_1.jpg?version=1619512503&v=1619512503",
            title: "テクノロジーマップ",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https:	//d2utiq8et4vl56.cloudfront.net/files/user/pdf/techinfo/AIDataTechnologyMap_210520.pdf?v=1621566300",
            video_playback_position: 0
        }

        const content4: Content = {
            content_id: 0,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: false,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https:	//i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "ながああああああああああああああああああああああああああああああああああああああああああああああああああああいタイトル",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https:	//www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content5: Content = {
            content_id: 0,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: false,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https:	//i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https:	//www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        contentList = [content1, content2, content3, content4, content5]
        	// contentList = []
    }

    function fetchFolderContentList(folderId: number) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/folder/${folderId}/content`
        return fetch(url, {
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            }
        }).then(processFetchedResponse).catch(error => {
            console.error(error)
        })

        function processFetchedResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response)
            } else {
                return response.json().then((contentListJson: any) => {
                    // TODO: JSONにバリデーションをかけたい(参考: https://zenn.dev/uzimaru0000/articles/json-type-validation)
                    contentList = contentListJson.data.content
                })
            }
        }
    }

    // コンテンツviewを生成する
    function generateContentView(): string {
        let contentViewTl: string = ``

        for (const content of contentList) {
            const domain = new URL(content.url).host
            const dateTime = new Date(content.updated_at)
            const month = dateTime.getMonth() + 1
            const date = dateTime.getDate()

            const viewTl = `
            <div class="content-view">
                <div class="content-thumbnail-view">
                    <img src="${content.thumbnail_img_url}" class="content-thumbnail-img" width="50px" height="50px">
                </div>
                <div class="content-info">
                    <div class="content-info-text-area">
                        <p class="content-title">${content.title}</p>
                        <p class="content-sub-info">${domain}・${month}月${date}日</p>
                    </div>
                </div>
            </div>
            `
            contentViewTl += viewTl
        }
        contentViewTl += `<h6 id="saved-content-text">5コンテンツ</h6>`
        return contentViewTl
    }

    // コンテンツのviewを表示する
    function renderContentView(contentViewTl: string) {
        const contentListView = document.getElementsByClassName("content-list-view")[0]
        if (contentListView !== null) {
            contentListView.innerHTML = contentViewTl
        }
    }

    // コンテンツにイベントを登録する
    function addEventToContentView() {
        const contentView = document.getElementsByClassName('content-view')
        for (let i = 0; i < contentView.length; i++) {
            contentView[i].addEventListener("click", function () {
                openContent(i)
            }, false)
        }
    }

    // コンテンツを新しいタブで開く
    async function openContent(index: number) {
        const targetContent: Content = contentList[index]
        const url: string = targetContent.url
        await chrome.tabs.create({url})
        chrome.runtime.sendMessage(targetContent)
    }

    // main領域にコンテンツ一覧を表示する
    export async function initializeContent(folderId: number|null) {
        //NOTE:  folderIdは0(falthy)である可能性があるかもしれないので三項演算子が使えない？
        if (folderId !== null) {
            await fetchFolderContentList(folderId)
        } else {
            // await fetchContentList()
            await dummyFetchContentList()
        }
        const contentViewTl = await generateContentView()
        await renderContentView(contentViewTl)
        addEventToContentView()
    }

    initializeContent(null)
}
