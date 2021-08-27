module contentList {
    export let folderList: Folder[] = []

    // フォルダ一覧を取得する
    function doGetFolderList() {
        const url = "https://web-shiori.herokuapp.com/v1/folder"
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                'client': currentUser!.client,
                'uid': currentUser!.uid
            }
        }).then(processFetchedResponse).catch(error => {
            console.error(error)
        })

        function processFetchedResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response)
            } else {
                return response.json().then((folderListJson: any) => {
                    folderList = folderListJson.data.folder
                })
            }
        }
    }

    // フォルダを新規作成する
    function doPostFolder(folder: PostFolder) {
        const url = `https://web-shiori.herokuapp.com/v1/folder`
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access-token': currentUser!.accessToken,
                'client': currentUser!.client,
                'uid': currentUser!.uid
            },
            body: JSON.stringify(folder)
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response.json());
            } else {
                initializeSideMenu()
            }
        }
    }

    // フォルダを削除するリクエストを送る
    function doDeleteFolder(folderId: number) {
        const url = `https://web-shiori.herokuapp.com/v1/folder/${folderId}`
        return fetch(url, {
            method: 'delete',
            headers: {
                'access-token': currentUser!.accessToken,
                'client': currentUser!.client,
                'uid': currentUser!.uid
            }
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            } else {
                // サイドメニューをリロードする
                initializeSideMenu()
            }
        }
    }

    // フォルダviewを生成する
    async function generateFolderView(): Promise<string> {
        let folderViewTl = await generateFolderListViewTl()
        folderViewTl += generateFolderCreateViewTl()
        return folderViewTl
    }

    // TODO: これとgenerateFolderListViewTlほぼ一緒だからコード共有できる
    // TODO: メイン画面に表示されるのにsideMenuに実装されているのはおかしい
    // TODO: CSSのクラス名・id名を修正
    // フォルダにコンテンツを追加する時にフォルダを選択するモーダルviewを生成する
    function generateFolderViewForSelectedModal(): Promise<string> {
        return new Promise<string>((resolve => {
            let selectFolderModalViewTl: string = ``
            for (let i = 0; i < folderList.length; i++) {
                const viewTl = `
                <div id="folder-view-select-folder-modal-${i}" class="folder-view-select-folder-modal">
                    <div class="folder-text-area-select-folder-modal">
                        <p class="folder-info-select-folder-modal">
                            <i class="bi bi-folder2"></i>
                            <p class="folder-view-name-select-folder-modal">${folderList[i].name}</p>
                            <span class="folder-view-right-area-select-folder-modal">
                                <p id="folder-view-content-count-${i}" class="folder-view-content-count-select-folder-modal">
                                    ${folderList[i].content_count}
                                </p>
                            </span>
                        </p>
                    </div>
                </div>
                `
                selectFolderModalViewTl += viewTl
            }
            resolve(selectFolderModalViewTl)
        }))
    }

    // フォルダリストviewを生成
    function generateFolderListViewTl(): Promise<string> {
        return new Promise((resolve => {
            console.log("generateFolderListViewTl")
            let folderListViewTl = ``
            for (let i = 0; i < folderList.length; i++) {
                const viewTl = `
                <div class="folder-view">
                    <div class="folder-text-area">
                        <p class="folder-info">
                            <i class="bi bi-folder2"></i>
                            <p class="folder-view-name">${folderList[i].name}</p>
                            <span class="folder-view-right-area">
                                <p id="folder-view-content-count-${i}" class="folder-view-content-count">
                                    ${folderList[i].content_count}
                                </p>
                                <i class="bi bi-x folder-delete-button" id="folder-delete-button-${i}" style="visibility: hidden"></i>
                            </span>
                            
                        </p>
                    </div>
                </div>
            `
                folderListViewTl += viewTl
            }
            resolve(folderListViewTl)
        }))
    }

    // フォルダ新規作成フォームのviewを生成
    function generateFolderCreateViewTl(): string {
        const folderCreateViewTl = `
        <div id="folder-create-view" class="folder-create-view folder-view" style="visibility: hidden">
            <form id="folder-create-form" class="form-inline">
                <input id="folder-name-text-field" placeholder="新しいフォルダ">
            </form>
        </div>
        `
        return folderCreateViewTl
    }

    // TODO: これPromiseを返さないとawaitの意味ない
    // フォルダのviewを表示する
    function renderFolderView(folderViewTl: string, folderViewForSelectedModalTl: string) {
        const folderListView = document.getElementsByClassName("folder-list-view")[0]
        const selectFolderModalView = document.getElementById("select-folder-modal")
        const selectFolderListModalView = document.getElementsByClassName("select-folder-list-view")[0]

        if (selectFolderModalView === null) return

        folderListView.innerHTML = folderViewTl
        selectFolderListModalView.innerHTML = folderViewForSelectedModalTl
    }

    // サイドメニューのviewにイベントを登録する
    function addEventToSideMenuView() {
        addEventToFolderView()
        addSubmitEventToFolderCreateFormView()
    }

    // フォルダviewにクリックイベントを追加
    function addEventToFolderView() {
        const folderVIew = document.getElementsByClassName("folder-view")
        for (let i = 0; i < folderVIew.length; i++) {
            // クリックイベントを追加
            folderVIew[i].addEventListener("click", function (event) {
                /*
                    NOTE: 本当は・・・ボタンを表示して、クリックしたらドロップダウンメニューを表示し、
                    そこで削除ボタンを選ばせたかった。ただinnerHTMLでpopper.jsを読み込む方法がわからず、
                    断念した。妥協策として削除ボタンを表示してクリックしたらフォルダを削除するようにした。
                 */
                // フォルダ削除ボタンをクリックした場合
                if ((<HTMLInputElement>event.target).id === `folder-delete-button-${i}`) {
                    doDeleteFolder(folderList[i].folder_id)
                } else {
                    // その他をクリックした場合、そのフォルダ内のコンテンツを表示する
                    folderVIew[i].classList.add("selected-folder-view")
                    currentFolderId = folderList[i].folder_id
                    initializeContent("", currentFolderId)
                }
            })
            // マウスオーバーイベントを追加
            folderVIew[i].addEventListener("mouseover", function () {
                const folderEditButtonView = document.getElementById(`folder-delete-button-${i}`)
                if (folderEditButtonView === null) return
                folderEditButtonView.style.visibility = "visible"
            })
            // マウスリーブイベントを追加
            folderVIew[i].addEventListener("mouseleave", function () {
                const folderEditButtonView = document.getElementById(`folder-delete-button-${i}`)
                if (folderEditButtonView === null) return
                folderEditButtonView.style.visibility = "hidden"
            })
        }
    }

    // フォルダ新規作成フォームviewにサブミットイベントを追加
    function addSubmitEventToFolderCreateFormView() {
        const folderCreateForm = document.getElementById("folder-create-form")
        if (folderCreateForm === null) return
        folderCreateForm.onsubmit = function () {
            getInputedFolderName().then((inputedFolderName => {
                const postFolder: PostFolder = { name: inputedFolderName }
                doPostFolder(postFolder)
            }))
            // ページのリロードを防ぐ
            return false;
        }

    }

    // フォルダにコンテンツを追加する時にフォルダを選択するモーダルviewにイベントを追加する
    // TODO: 登録したイベントを消さないと複数回フォルダに追加したときに何回も発動してしまう。直す
    export function addEventToFolderViewForSelectedModal(contentId: number) {
        const selectFolderModalView = document.getElementsByClassName("folder-view-select-folder-modal")
        for (let i = 0; i < selectFolderModalView.length; i++) {
            selectFolderModalView[i].addEventListener("click", function () {
                doPostContentToFolder(contentId, folderList[i].folder_id)
            }, { once: true })
        }
        // TODO: リファクタリング
        const selectFolderViewCloseButton = document.getElementById("select-folder-view-close-button")
        if (selectFolderViewCloseButton === null) return
        selectFolderViewCloseButton.addEventListener('click', function () {
            const selectFolderModal = document.getElementById("select-folder-modal")
            if (selectFolderModal !== null) selectFolderModal.style.visibility = "hidden"
        })
    }


    // フォルダ新規作成フォームに入力されたフォルダ名を取得する
    function getInputedFolderName(): Promise<string> {
        const inputedFolderName = (<HTMLInputElement>document.getElementById("folder-name-text-field")).value || ""
        return new Promise<string>((resolve => {
            if (inputedFolderName) resolve(inputedFolderName)
        }))
    }

    // サイドメニューにフォルダを表示する
    async function initializeSideMenu() {
        startIndicator("sidemenu-indicator")
        await doGetFolderList()
        const folderViewTl = await generateFolderView()
        const folderViewForSelectedModalTl = await generateFolderViewForSelectedModal()
        await renderFolderView(folderViewTl, folderViewForSelectedModalTl)
        addEventToSideMenuView()
        stopIndicator("sidemenu-indicator")
    }

    // ページを開いたときの処理
    initializeSideMenu()
}
