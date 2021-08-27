class User {
    constructor(uid: string, client: string, accessToken: string) {
        this.uid = uid
        this.client = client
        this.accessToken = accessToken
    }

    get uid(): string {
        return this.uid
    }

    set uid(newUid: string) {
        this.uid = newUid
    }

    get client(): string {
        return this.client
    }

    set client(newClient: string) {
        this.client = newClient
    }

    get accessToken(): string {
        return this.accessToken
    }

    set accessToken(newAccessToken: string) {
        this.accessToken = newAccessToken
    }
}
