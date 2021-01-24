export enum DatabaseCollections {
    Users = 'users',
    Accounts = 'accounts',
    Sessions = 'sessions'
}

export type DatabaseId = string;
export type Timestamp = string;
export type DocumentModel<T> = T & {
    id: DatabaseId
}

export type User = {
    name: string,
    email: string,
    image: string
}

export type Account = {
    userId: DatabaseId,
    providerId: string,
    providerType: string,
    providerAccountId: string,
    refreshToken: string,
    accessToken: string,
    accessTokenExpires: Timestamp
}

export type Session = {
    expires: Timestamp,
    userId: DatabaseId,
    sessionToken: string,
    accessToken: string
}

export type SessionAge = {
    maxAge: number,
    updateAge: number
}