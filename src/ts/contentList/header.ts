module contentList {
    // ログアウトボタンを押したときの処理
    const contentListSignOutButton = document.getElementById(
        'content-list-sign-out-button'
    );
    if (contentListSignOutButton !== null) {
        contentListSignOutButton.addEventListener('click', function () {
            chrome.storage.sync.remove(
                ['uid', 'client', 'accessToken'],
                function () {
                    console.log('removed');
                }
            );
            window.close();
        });
    }

    // 入力された検索ワードを取得
    function getSearchQuery(): Promise<string> {
        const searchQuery =
            (<HTMLInputElement>document.getElementById('search-text-field'))
                .value || '';
        return new Promise<string>((resolve) => {
            resolve(searchQuery);
        });
    }

    // 検索フォームでsubmitしたときの処理
    const searchForm = document.getElementById('search-form');
    if (searchForm !== null) {
        searchForm.onsubmit = function () {
            getSearchQuery().then((searchQuery) => {
                initializeContent(searchQuery, currentFolderId);
            });
            // ページのリロードを防ぐ
            return false;
        };
    }

    // フォルダ追加ボタンをクリックしたときの処理
    const addingFolderButton = document.getElementById('adding-folder-button');
    if (addingFolderButton !== null) {
        addingFolderButton.addEventListener('click', function () {
            // フォルダを追加するためのviewを表示する
            const folderCreateView =
                document.getElementById('folder-create-view');
            const folderNameTextField = document.getElementById(
                'folder-name-text-field'
            );
            if (folderCreateView === null || folderNameTextField === null)
                return;
            folderCreateView.style.visibility = 'visible';
            folderNameTextField.focus();
        });
    }
}
