module popup {
    let contentList: Content[] = [];

    // コンテンツ一覧を取得する(上限5個)
    function doGetContentList() {
        console.log(currentUser?.accessToken);
        const per_page = 5;
        return fetch(
            `https://web-shiori.herokuapp.com/v1/content?per_page=${per_page}?page=1`,
            {
                // headersの値も修正する
                headers: {
                    'access-token': currentUser!.accessToken,
                    client: currentUser!.client,
                    uid: currentUser!.uid,
                },
            }
        )
            .then(processFetchedResponse)
            .catch((error) => {
                console.error(error);
            });

        function processFetchedResponse(response: any) {
            if (!response.ok) {
                // 認証エラーの場合ログイン画面を表示する
                if (response.status === 401) {
                    window.close();
                    openSignInView();
                } else {
                    // TODO: エラー時の処理を実装する
                    console.error('エラーレスポンス', response);
                }
            } else {
                return response.json().then((contentListJson: any) => {
                    // TODO: JSONにバリデーションをかけたい(参考: https://zenn.dev/uzimaru0000/articles/json-type-validation)
                    contentList = contentListJson.data.content;
                });
            }
        }
    }

    // コンテンツviewを生成する
    function generateContentView() {
        let contentViewTl = `
    <h6 id="saved-content-text">保存済みのコンテンツ</h6>
    `;

        // 保存済みのコンテンツが無い時の表示
        if (contentList.length === 0) {
            const contentListView =
                document.getElementById('content-list-view');
            const showContentListViewButtonView = document.getElementById(
                'show-content-list-view-button'
            );
            const footerView = document.getElementById('footer-view');
            if (contentListView !== null) {
                contentListView.style.display = 'none';
            }
            if (showContentListViewButtonView !== null) {
                showContentListViewButtonView.style.display = 'none';
            }
            if (footerView !== null) {
                footerView.style.marginTop = '0';
            }
        }

        for (const content of contentList) {
            const domain = new URL(content.url).host;
            const dateTime = new Date(content.updated_at);
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();

            const viewTl = `
        <div class="content-view">
            <div class="content-thumbnail-view">
                <img src="${content.thumbnail_img_url}" class="content-thumbnail-img">
            </div>
            <div class="content-info">
                <div class="content-info-text-area">
                    <p class="content-title">${content.title}</p>
                    <p class="content-sub-info">${domain}・${month}月${date}日</p>
                </div>
            </div>
        </div>
        `;
            contentViewTl += viewTl;
        }
        return contentViewTl;
    }

    // コンテンツのviewを表示する
    function renderContentView(contentViewTl: string) {
        const contentListView = document.getElementById('content-list-view');
        if (contentListView !== null) {
            contentListView.innerHTML = contentViewTl;
        }
    }

    // コンテンツにイベントを登録する
    function addEventToContentView() {
        const contentView = document.getElementsByClassName('content-view');
        for (let i = 0; i < contentView.length; i++) {
            contentView[i].addEventListener(
                'click',
                function () {
                    openContent(i);
                },
                false
            );
        }
    }

    // コンテンツを新しいタブで開く
    async function openContent(index: number) {
        const targetContent: Content = contentList[index];
        const url: string = targetContent.specified_text
            ? generateUrlForSpecifiedText(
                  targetContent.sharing_url,
                  targetContent.specified_text
              )
            : targetContent.sharing_url;
        await chrome.tabs.create({ url });
        chrome.runtime.sendMessage(targetContent);
    }

    // 指定したテキストを復元するためのリンクを生成する
    function generateUrlForSpecifiedText(
        url: string,
        specifiedText: string
    ): string {
        return encodeURI(url + '#:~:text=' + specifiedText);
    }

    /*
    NOTE: contentList/popup.tsにも同じコードある
     */
    // インジケータを表示する
    export function startIndicator(indicatorElementId: string) {
        const indicator = document.getElementById(indicatorElementId);
        if (indicator !== null) indicator.style.display = 'flex';
    }

    // インジケータを非表示にする
    export function stopIndicator(indicatorElementId: string) {
        const contentIndicator = document.getElementById(indicatorElementId);
        if (contentIndicator !== null) contentIndicator.style.display = 'none';
    }

    // ポップアップviewにコンテンツを表示する
    async function initializeContent() {
        const isLoggedInUser = await setCurrentUser();
        if (!isLoggedInUser) {
            window.close();
            openSignInView();
        }
        // NOTE: 表示にちょっと時間がかかる(仕方ない？)
        startIndicator('content-list-indicator-area');
        await doGetContentList();
        const contentViewTl = await generateContentView();
        await renderContentView(contentViewTl);
        addEventToContentView();

        stopIndicator('content-list-indicator-area');
    }

    function main() {
        initializeContent();
    }

    main();
}
