export enum DatabaseCollections {
    Users = 'users',
    Accounts = 'accounts',
    Sessions = 'sessions',
    Clips = 'clips'
}

export type DatabaseId = string;
export type Timestamp = string;
export type DocumentModel<T> = T & {
    id: DatabaseId
}

export type User = {
    name: string,
    email: string,
    image: string,
    roles: Role[]
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

export type Clip = {
    id: string,
    time: Date,
    name: string,
    url: string,
    clipstart: number,
    clipend: number,
    participants: string[],
    duration: number
}


export type Role = "user"
| "5v5-uploader"
| "admin"