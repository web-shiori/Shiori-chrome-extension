module contentList {
    let folderList: Folder[] = []

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
                    console.log(folderList)
                })
            }
        }
    }

    function generateFolderView(): string {
        let folderViewTl: string = `
        `

        for (const folder of folderList) {
            const viewTl = `
            <div class="folder-view">
                <div class="folder-text-area">
                    <p class="folder-info">${folder.name} ${folder.content_count}</p>
                </div>
            </div>
            `
            folderViewTl += viewTl
        }

        return folderViewTl
    }

    function renderFolderView(folderViewTl: string) {
        const folderListView = document.getElementsByClassName("folder-list-view")[0]
        if (folderListView !== null) {
            folderListView.innerHTML = folderViewTl
        }
    }

    function addEventToFolderView() {

    }

    async function initializeFolder() {
        // フォルダ一覧取得
        await fetchFolderList()
        // html作成
        const folderViewTl = await generateFolderView()
        // 表示
        await renderFolderView(folderViewTl)
        // イベント追加
        addEventToFolderView()
    }

    initializeFolder()
}
