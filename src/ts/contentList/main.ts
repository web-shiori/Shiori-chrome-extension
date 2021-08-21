module contentList {
    export let currentFolderId: number|null = null
    let contentList: Content[] = []

    // コンテンツ一覧を取得する
    // function doGetContentList(query: string) {
    //     // TODO: URLを本番APIに修正する
    //     const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content?q=${query}`
    //     return fetch(url, {
    //         // TODO: 認証用のヘッダを本場用に修正する
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
            content_id: 1,
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
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content2: Content = {
            content_id: 2,
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
            thumbnail_img_url: "https://gyazo.com/f149c85d239c13b76388822357755672/thumb/400",
            title: "アイデア",
            type: "",
            updated_at: "2020-05-12T20:48:24.000+09:00",
            url: "https://qiita.com/MasatoraAtarashi/items/eec4642fe1e6ce79304d",
            video_playback_position: 0
        }

        const content3: Content = {
            content_id: 3,
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
            thumbnail_img_url: "https://hayabusa.io/ca/files/topics/26111_ext_24_1.jpg?version=1619512503&v=1619512503",
            title: "テクノロジーマップ",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://d2utiq8et4vl56.cloudfront.net/files/user/pdf/techinfo/AIDataTechnologyMap_210520.pdf?v=1621566300",
            video_playback_position: 0
        }

        const content4: Content = {
            content_id: 4,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "ながああああああああああああああああああああああああああああああああああああああああああああああああああああいタイトル",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content5: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content6: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content13: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content7: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content8: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content9: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content10: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content11: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        const content12: Content = {
            content_id: 5,
            created_at: "",
            delete_flag: false,
            deleted_at: "",
            file_url: "",
            liked: true,
            max_scroll_position_x: 0,
            max_scroll_position_y: 0,
            scroll_position_x: 0,
            scroll_position_y: 0,
            sharing_url: "",
            specified_dom_class: "",
            specified_dom_id: "",
            specified_dom_tag: "",
            specified_text: "",
            thumbnail_img_url: "https://i.ytimg.com/vi/xP_Ovd8-GM8/maxresdefault.jpg",
            title: "Web-Shioriデモ動画",
            type: "",
            updated_at: "2019-05-12T20:48:24.000+09:00",
            url: "https://www.youtube.com/watch?v=1DcjMwkmNvA",
            video_playback_position: 30
        }

        contentList = [content1, content2, content3, content4, content5, content6, content7, content8,content9,content10,content11,content12, content13]
        contentList = []
        // contentList = [content1, content2, content3, content4, content5]
    }

    // フォルダに含まれているコンテンツ一覧を取得する
    function doGetFolderContentList(query: string, folderId: number) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/folder/${folderId}/content?q=${query}`
        return fetch(url, {
            // TODO: 認証用のヘッダを本場用に修正する
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

    // コンテンツ削除リクエスト
    function doDeleteContent(contentId: number) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content/${contentId}`
        return fetch(url, {
            method: 'delete',
            // TODO: 認証用のヘッダを本場用に修正する
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            }
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            } else {
                // TODO: コンテンツをリロードしないで削除したコンテンツだけ画面から消すように変える
                // コンテンツをリロードする
                initializeContent("", currentFolderId)
            }
        }
    }

    // コンテンツをお気に入りに登録する
    function doPostFavoriteContent(contentId: number) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content/${contentId}/like`
        return fetch(url, {
            method: 'post',
            // TODO: 認証用のヘッダを本場用に修正する
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            }
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            }
        }
    }

    // コンテンツのお気に入りを解除する
    function doDeleteUnfavoriteContent(contentId: number) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/content/${contentId}/like`
        return fetch(url, {
            method: 'delete',
            // TODO: 認証用のヘッダを本場用に修正する
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            }
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            }
        }
    }

    // コンテンツをフォルダに追加する
    export function doPostContentToFolder(contentId: number, folderId: number) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/folder/${folderId}/content/${contentId}`
        return fetch(url, {
            method: 'post',
            // TODO: 認証用のヘッダを本場用に修正する
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            }
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            } else {
                // モーダル非表示にする
                const selectFolderModal = document.getElementById("select-folder-modal")
                if (selectFolderModal !== null) selectFolderModal.style.visibility = "hidden"
            }
        }
    }

    // コンテンツviewを生成する
    function generateContentView(): string {
        let contentViewTl: string = ``

        for (let i = 0; i < contentList.length; i++) {
            const domain = new URL(contentList[i].url).host
            const dateTime = new Date(contentList[i].updated_at)
            const month = dateTime.getMonth() + 1
            const date = dateTime.getDate()

            const viewTl = `
            <div class="content-view">
                <div class="content-thumbnail-view">
                    <img src="${contentList[i].thumbnail_img_url}" class="content-thumbnail-img">
                </div>
                <div class="content-info">
                    <span class="content-info-text-area">
                        <p class="content-title">${contentList[i].title}</p>
                        <p class="content-sub-info" style="display: inline">${domain}・${month}月${date}日</p>
                    </span>
                </div>
                <span id="content-button-area-${i}" class="content-button-area" style="visibility: hidden">
                    <span><i id="content-button-folder-${i}" class="bi-folder content-button"></i></span>
                    <span><i id="content-button-heart-${i}" class="${contentList[i].liked ? 'bi-heart-fill' : 'bi-heart'} content-button"></i></span>
                    <span><i id="content-button-trash-${i}" class="bi-trash content-button"></i></span>
                </span>
            </div>
            `
            contentViewTl += viewTl
        }
        contentViewTl += `<h6 id="saved-content-text">${contentList.length}コンテンツ</h6>`
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
            contentView[i].addEventListener("click", function (event) {
                const targetContent: Content = contentList[i]
                switch ((<HTMLInputElement>event.target).id) {
                    // フォルダに追加ボタンクリック
                    case `content-button-folder-${i}`:
                        addContentToFolder(targetContent.content_id)
                        break
                    // お気に入りボタンクリック
                    case `content-button-heart-${i}`:
                        targetContent.liked ? unfavoriteContent(i) : favoriteContent(i)
                        break
                    // 削除ボタンクリック
                    case `content-button-trash-${i}`:
                        // TODO: リファクタリング
                        doDeleteContent(contentList[i].content_id)
                        break
                    // その他の場所をクリック
                    default:
                        openContent(i)
                        break
                }
            }, false)

            // 各コンテンツのボタンにイベントを追加
            const contentButtonAreaView = document.getElementById(`content-button-area-${i}`)
            if (contentButtonAreaView === null) return

            // マウスがホバーしたらボタンを表示する
            contentView[i].addEventListener("mouseover", function () {
                contentButtonAreaView.style.visibility = "visible"
            })

            // マウスが外れたらボタンを非表示にする
            contentView[i].addEventListener("mouseout", function () {
                contentButtonAreaView.style.visibility = "hidden"
            })
        }
    }

    // コンテンツをフォルダに追加する
    function addContentToFolder(contentId: number) {
        // モーダルにイベント追加
        addEventToFolderViewForSelectedModal(contentId)
        // モーダル表示
        const selectFolderModal = document.getElementById("select-folder-modal")
        if (selectFolderModal !== null) selectFolderModal.style.visibility = "visible"
    }

    // コンテンツをお気に入りに登録する
    function favoriteContent(contentListIndex: number) {
        const contentButtonHeart = document.getElementById(`content-button-heart-${contentListIndex}`)
        if (contentButtonHeart === null) return

        // お気に入り登録リクエストを送信
        const contentId = contentList[contentListIndex].content_id
        doPostFavoriteContent(contentId)
        // お気に入りボタンのスタイルを変更する
        contentButtonHeart.className = "bi-heart-fill content-button"
        // コンテンツのプロパティを変更
        contentList[contentListIndex].liked = true
    }

    // コンテンツをお気に入り解除する
    function unfavoriteContent(contentListIndex: number) {
        const contentButtonHeart = document.getElementById(`content-button-heart-${contentListIndex}`)
        if (contentButtonHeart === null) return

        // お気に入り登録リクエストを送信
        const contentId = contentList[contentListIndex].content_id
        doDeleteUnfavoriteContent(contentId)
        // お気に入りボタンのスタイルを変更する
        contentButtonHeart.className = "bi-heart content-button"
        // コンテンツのプロパティを変更
        contentList[contentListIndex].liked = false
    }

    // コンテンツを新しいタブで開く
    async function openContent(index: number) {
        const targetContent: Content = contentList[index]
        const url: string = targetContent.url
        await chrome.tabs.create({url})
        chrome.runtime.sendMessage(targetContent)
    }

    /*
    NOTE: すべてのview共通で使えるようにしたいがうまくできなかった
        https://qiita.com/pokotyan/items/f568679cd27bbf888435
        https://www.i-ryo.com/entry/2020/07/14/072538#exports-is-not-defined%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AFCommonJS%E3%81%8C%E5%8E%9F%E5%9B%A0
        https://uraway.hatenablog.com/entry/2015/11/30/require_is_not_defined%E3%82%92%E8%A7%A3%E6%B6%88%E3%81%97%E3%81%A6require%E3%82%92%E4%BD%BF%E3%81%88%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B
        uncaught (in promise) TypeError: contentList_1.startIndicator is not a function
     */
    // インジケータを表示する
    export function startIndicator(indicatorElementId: string) {
        const indicator = document.getElementById(indicatorElementId)
        if (indicator !== null) indicator.style.display = "flex"
    }

    // インジケータを非表示にする
    export function stopIndicator(indicatorElementId: string) {
        const contentIndicator = document.getElementById(indicatorElementId)
        if (contentIndicator !== null) contentIndicator.style.display = "none"
    }

    // main領域にコンテンツ一覧を表示する
    export async function initializeContent(query: string, folderId: number|null) {
        startIndicator("content-list-indicator-area")
        //NOTE:  folderIdは0(falthy)である可能性があるかもしれないので三項演算子が使えない？
        if (folderId !== null) {
            await doGetFolderContentList(query, folderId)
        } else {
            // await doGetContentList(query)
            await dummyFetchContentList()
        }
        const contentViewTl = await generateContentView()
        await renderContentView(contentViewTl)
        addEventToContentView()

        stopIndicator("content-list-indicator-area")
    }

    // ページを開いたときの処理
    initializeContent("", null)
}
