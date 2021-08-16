module contentList {
    let folderList: Folder[] = []

    // フォルダ一覧を取得する
    function fetchFolderList() {
        // TODO: URLを本番APIに修正する
        const url = "https://virtserver.swaggerhub.com/Web-Shiori/Web-Shiori/1.0.0/v1/folder"
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
                return response.json().then((folderListJson: any) => {
                    folderList = folderListJson.data.folder
                })
            }
        }
    }

    // フォルダviewを生成する
    function generateFolderView(): string {
        let folderViewTl: string = `
        `

        for (const folder of folderList) {
            const viewTl = `
            <div class="folder-view">
                <div class="folder-text-area">
                    <p class="folder-info"><i class="bi-gear-fill"></i>${folder.name} ${folder.content_count}</p>
                </div>
            </div>
            `
            folderViewTl += viewTl
        }

        return folderViewTl
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
        const folderVIew = document.getElementsByClassName("folder-view")
        for (let i = 0; i < folderVIew.length; i++) {
            folderVIew[i].addEventListener("click", function () {
                folderVIew[i].classList.add("selected-folder-view")
                initializeContent(i)
            })
        }
    }

    // サイドメニューにフォルダを表示する
    async function initializeSideMenu() {
        await fetchFolderList()
        const folderViewTl = await generateFolderView()
        await renderFolderView(folderViewTl)
        addEventToFolderView()
    }

    initializeSideMenu()
}
