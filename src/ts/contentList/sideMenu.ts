module contentList {
    export let folderList: Folder[] = []

    // フォルダ一覧を取得する
    function doGetFolderList() {
        // TODO: URLを本番APIに修正する
        const url = "https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/folder"
        fetch(url, {
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
                return response.json().then((folderListJson: any) => {
                    folderList = folderListJson.data.folder
                })
            }
        }
    }

    // フォルダを新規作成する
    function doPostFolder(folder: PostFolder) {
        // TODO: URLを本番APIに修正する
        const url = `https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/folder`
        fetch(url, {
            method: 'POST',
            headers: {
                'access-token': 'access-token',
                'client': 'client',
                'uid': 'uid'
            },
            body: JSON.stringify(folder)
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                console.error("エラーレスポンス", response);
            } else {
                initializeSideMenu()
            }
        }
    }

    // フォルダviewを生成する
    function generateFolderView(): string {
        let folderViewTl: string = generateFolderListViewTl()
        folderViewTl += generateFolderCreateViewTl()
        return folderViewTl
    }

    // フォルダリストviewを生成
    function generateFolderListViewTl(): string {
        let folderListViewTl = ``
        for (const folder of folderList) {
            const viewTl = `
            <div class="folder-view">
                <div class="folder-text-area">
                    <p class="folder-info"><i class="bi-gear-fill"></i>${folder.name} ${folder.content_count}</p>
                </div>
            </div>
            `
            folderListViewTl += viewTl
        }
        return folderListViewTl
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

    // フォルダのviewを表示する
    function renderFolderView(folderViewTl: string) {
        const folderListView = document.getElementsByClassName("folder-list-view")[0]
        if (folderListView !== null) {
            folderListView.innerHTML = folderViewTl
        }
    }

    // フォルダにイベントを登録する
    function addEventToFolderView() {
        addClickEventToFolderView()
        addSubmitEventToFolderCreateFormView()
    }

    // フォルダにクリックイベントを追加
    function addClickEventToFolderView() {
        const folderVIew = document.getElementsByClassName("folder-view")
        for (let i = 0; i < folderVIew.length; i++) {
            folderVIew[i].addEventListener("click", function () {
                folderVIew[i].classList.add("selected-folder-view")
                currentFolderId = folderList[i].folder_id
                initializeContent("", currentFolderId)
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
        await renderFolderView(folderViewTl)
        addEventToFolderView()
        stopIndicator("sidemenu-indicator")
    }

    // ページを開いたときの処理
    initializeSideMenu()
}
