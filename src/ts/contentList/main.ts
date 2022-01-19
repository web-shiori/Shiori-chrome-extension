module contentList {
    /**
     * 認証関連のコード
     * 本当はリファクタリングしたいが、jsにトランスパイルした後でエラーが出るので暫定で個別に実装する
     * popup/popup.tsにも同じコードを定義している
     */
    export let currentUser: User | undefined = undefined;
    // currentUserにユーザをセットする
    export function setCurrentUser(): Promise<boolean> {
        return new Promise((resolve) => {
            chrome.storage.sync.get(
                ['uid', 'client', 'accessToken'],
                function (value) {
                    if (value.uid && value.client && value.accessToken) {
                        currentUser = {
                            uid: value.uid.value,
                            client: value.client.value,
                            accessToken: value.accessToken.value,
                        };
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            );
        });
    }

    // ログイン画面を開く
    export function openSignInView() {
        chrome.windows.create({
            url: '../html/signIn.html',
            type: 'popup',
        });
    }

    /**
     * コンテンツ一覧画面のコード
     */
    export let currentFolderId: number | null = null;
    let contentList: Content[] = [];
    // TODO: リファクタリング
    // NOTE: これも本当はリファクタリングしたい
    export const baseUrl: string = 'https://web-shiori.herokuapp.com';

    // コンテンツ一覧を取得する
    function doGetContentList(query: string, liked: boolean) {
        const url = `${baseUrl}/v1/content?q=${query}&per_page=1000&liked=${liked}`;
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                client: currentUser!.client,
                uid: currentUser!.uid,
            },
        })
            .then(processFetchedResponse)
            .catch((error) => {
                console.error(error);
            });

        function processFetchedResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error('エラーレスポンス', response);
            } else {
                return response.json().then((contentListJson: any) => {
                    // TODO: JSONにバリデーションをかけたい(参考: https://zenn.dev/uzimaru0000/articles/json-type-validation)
                    contentList = contentListJson.data.content;
                });
            }
        }
    }

    // フォルダに含まれているコンテンツ一覧を取得する
    function doGetFolderContentList(query: string, folderId: number) {
        const url = `${baseUrl}/v1/folder/${folderId}/content?q=${query}`;
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                client: currentUser!.client,
                uid: currentUser!.uid,
            },
        })
            .then(processFetchedResponse)
            .catch((error) => {
                console.error(error);
            });

        function processFetchedResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error('エラーレスポンス', response);
            } else {
                return response.json().then((contentListJson: any) => {
                    // TODO: JSONにバリデーションをかけたい(参考: https://zenn.dev/uzimaru0000/articles/json-type-validation)
                    contentList = contentListJson.data.content;
                });
            }
        }
    }

    // コンテンツを更新するリクエスト
    function doPutContent(contentId: number, liked: boolean) {
        const url = `${baseUrl}/v1/content/${contentId}`;
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                client: currentUser!.client,
                uid: currentUser!.uid,
            },
            body: JSON.stringify({ liked: liked }),
        })
            .then(processResponse)
            .catch((error) => {
                console.error(error);
            });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error('エラーレスポンス', response.json());
            }
        }
    }

    // コンテンツ削除リクエスト
    function doDeleteContent(contentId: number) {
        const url = `${baseUrl}/v1/content/${contentId}`;
        return fetch(url, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                client: currentUser!.client,
                uid: currentUser!.uid,
            },
        })
            .then(processResponse)
            .catch((error) => {
                console.error(error);
            });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error('エラーレスポンス', response);
            } else {
                // TODO: コンテンツをリロードしないで削除したコンテンツだけ画面から消すように変える
                // コンテンツをリロードする
                initializeContent('', currentFolderId);
            }
        }
    }

    // コンテンツをフォルダに追加する
    export function doPostContentToFolder(contentId: number, folderId: number) {
        const url = `${baseUrl}/v1/folder/${folderId}/content/${contentId}`;
        return fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                client: currentUser!.client,
                uid: currentUser!.uid,
            },
        })
            .then(processResponse)
            .catch((error) => {
                console.error(error);
            });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error('エラーレスポンス', response);
            } else {
                // モーダル非表示にする
                const selectFolderModal = document.getElementById(
                    'select-folder-modal'
                );
                if (selectFolderModal !== null)
                    selectFolderModal.style.visibility = 'hidden';
            }
        }
    }

    // コンテンツviewを生成する
    function generateContentView(): string {
        let contentViewTl: string = ``;

        for (let i = 0; i < contentList.length; i++) {
            const domain = new URL(contentList[i].url).host;
            const dateTime = new Date(contentList[i].updated_at);
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();

            const viewTl = `
            <div class="content-view">
                <div class="content-thumbnail-view">
                    <img src="${
                        contentList[i].thumbnail_img_url
                    }" class="content-thumbnail-img">
                </div>
                <div class="content-info">
                    <span class="content-info-text-area">
                        <p class="content-title">${contentList[i].title}</p>
                        <p class="content-sub-info" style="display: inline">${domain}・${month}月${date}日</p>
                    </span>
                </div>
                <span id="content-button-area-${i}" class="content-button-area" style="visibility: hidden">
                    <span><i id="content-button-folder-${i}" class="bi-folder content-button"></i></span>
                    <span><i id="content-button-heart-${i}" class="${
                contentList[i].liked ? 'bi-heart-fill' : 'bi-heart'
            } content-button"></i></span>
                    <span><i id="content-button-trash-${i}" class="bi-trash content-button"></i></span>
                </span>
            </div>
            `;
            contentViewTl += viewTl;
        }
        contentViewTl += `<h6 id="saved-content-text">${contentList.length}コンテンツ</h6>`;
        return contentViewTl;
    }

    // コンテンツのviewを表示する
    function renderContentView(contentViewTl: string) {
        const contentListView =
            document.getElementsByClassName('content-list-view')[0];
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
                function (event) {
                    const targetContent: Content = contentList[i];
                    switch ((<HTMLInputElement>event.target).id) {
                        // フォルダに追加ボタンクリック
                        case `content-button-folder-${i}`:
                            addContentToFolder(targetContent.id);
                            break;
                        // お気に入りボタンクリック
                        case `content-button-heart-${i}`:
                            targetContent.liked
                                ? unfavoriteContent(i)
                                : favoriteContent(i);
                            break;
                        // 削除ボタンクリック
                        case `content-button-trash-${i}`:
                            // TODO: リファクタリング
                            doDeleteContent(contentList[i].id);
                            break;
                        // その他の場所をクリック
                        default:
                            openContent(i);
                            break;
                    }
                },
                false
            );

            // 各コンテンツのボタンにイベントを追加
            const contentButtonAreaView = document.getElementById(
                `content-button-area-${i}`
            );
            if (contentButtonAreaView === null) return;

            // マウスがホバーしたらボタンを表示する
            contentView[i].addEventListener('mouseover', function () {
                contentButtonAreaView.style.visibility = 'visible';
            });

            // マウスが外れたらボタンを非表示にする
            contentView[i].addEventListener('mouseout', function () {
                contentButtonAreaView.style.visibility = 'hidden';
            });
        }
    }

    // コンテンツをフォルダに追加する
    function addContentToFolder(contentId: number) {
        // モーダルにイベント追加
        addEventToFolderViewForSelectedModal(contentId);
        // モーダル表示
        const selectFolderModal = document.getElementById(
            'select-folder-modal'
        );
        if (selectFolderModal !== null)
            selectFolderModal.style.visibility = 'visible';
    }

    // コンテンツをお気に入りに登録する
    function favoriteContent(contentListIndex: number) {
        const contentButtonHeart = document.getElementById(
            `content-button-heart-${contentListIndex}`
        );
        if (contentButtonHeart === null) return;

        // お気に入り登録リクエストを送信
        const contentId = contentList[contentListIndex].id;
        doPutContent(contentId, true);
        // お気に入りボタンのスタイルを変更する
        contentButtonHeart.className = 'bi-heart-fill content-button';
        // コンテンツのプロパティを変更
        contentList[contentListIndex].liked = true;
    }

    // コンテンツをお気に入り解除する
    function unfavoriteContent(contentListIndex: number) {
        const contentButtonHeart = document.getElementById(
            `content-button-heart-${contentListIndex}`
        );
        if (contentButtonHeart === null) return;

        // お気に入り登録リクエストを送信
        const contentId = contentList[contentListIndex].id;
        doPutContent(contentId, false);
        // お気に入りボタンのスタイルを変更する
        contentButtonHeart.className = 'bi-heart content-button';
        // コンテンツのプロパティを変更
        contentList[contentListIndex].liked = false;
    }

    // NOTE: content.tsのコピペ
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
    NOTE: すべてのview共通で使えるようにしたいがうまくできなかった
        https://qiita.com/pokotyan/items/f568679cd27bbf888435
        https://www.i-ryo.com/entry/2020/07/14/072538#exports-is-not-defined%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AFCommonJS%E3%81%8C%E5%8E%9F%E5%9B%A0
        https://uraway.hatenablog.com/entry/2015/11/30/require_is_not_defined%E3%82%92%E8%A7%A3%E6%B6%88%E3%81%97%E3%81%A6require%E3%82%92%E4%BD%BF%E3%81%88%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B
        uncaught (in promise) TypeError: contentList_1.startIndicator is not a function
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

    // main領域にコンテンツ一覧を表示する
    export async function initializeContent(
        query: string,
        folderId: number | null
    ) {
        // currentUserセット
        const isLoggedInUser = await setCurrentUser();
        if (!isLoggedInUser) {
            window.close();
            openSignInView();
        }
        startIndicator('content-list-indicator-area');
        //NOTE:  folderIdは0(falthy)である可能性があるかもしれないので三項演算子が使えない？
        if (folderId !== null) {
            if (folderId == -1) {
                // ホームフォルダ
                await doGetContentList(query, false);
            } else if (folderId == -2) {
                // お気に入りフォルダ
                await doGetContentList(query, true);
            } else {
                await doGetFolderContentList(query, folderId);
            }
        } else {
            await doGetContentList(query, false);
        }
        const contentViewTl = await generateContentView();
        await renderContentView(contentViewTl);
        addEventToContentView();

        stopIndicator('content-list-indicator-area');
    }

    function main() {
        initializeContent('', null);
    }

    main();
}
