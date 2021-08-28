module auth {
    export const baseUrl: string = "https://web-shiori.herokuapp.com"

    // ログインリクエスト
    function doPostSignIn(email: string, password: string) {
        const url = `${baseUrl}/v1/auth/sign_in`
        return fetch(url, {
            method: 'POST',
            // TODO: ヘッダをちゃんとする
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then(processResponse).catch(error => {
            console.error(error);
        });

        function processResponse(response: any) {
            if (!response.ok) {
                // TODO: エラー時の処理を実装する
                // TODO: ログインに失敗したことをユーザに伝える
                console.error("エラーレスポンス", response.json());
            } else {
                // ログイン画面を閉じる
                window.close()
                // コンテンツ一覧画面を表示する
                chrome.tabs.create({ url: "../html/contentList.html" })
            }
        }
    }


    // ログインフォームに入力されたメールアドレスを取得
    function getEmail(): Promise<string> {
        const email = (<HTMLInputElement>document.getElementById("sign-in-with-password-form-email")).value || ""
        return new Promise<string>((resolve => {
            resolve(email)
        }))
    }

    // ログインフォームに入力されたパスワードを取得
    function getPassword(): Promise<string> {
        const password = (<HTMLInputElement>document.getElementById("sign-in-with-password-form-password")).value || ""
        return new Promise<string>((resolve => {
            resolve(password)
        }))
    }

    // ログイン
    async function signIn() {
        //  メールアドレスとパスワードを取得
        const emailPromise = getEmail()
        const passwordPromise = getPassword()
        const [email, password] = await Promise.all([emailPromise, passwordPromise])
        // 送信
        doPostSignIn(email, password)
    }

    // ログイン用フォームにonsubmit時の処理を追加
    const signInWithPasswordForm = document.getElementById("sign-in-with-password-form")
    if (signInWithPasswordForm !== null) {
        signInWithPasswordForm.onsubmit = function () {
            signIn()
            return false;
        }
    }



}
