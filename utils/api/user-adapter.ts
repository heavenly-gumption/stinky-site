import { User } from "../../types/models"
import { AccountModel } from "../db/models/accounts"
import { SessionModel } from "../db/models/sessions"
import { UserModel } from "../db/models/users"

function Adapter(config: {
  db: FirebaseFirestore.Firestore
  }, options = {}) {

  const { db } = config
  const Users = UserModel(db)
  const Accounts = AccountModel(db)
  const Sessions = SessionModel(db)

  async function getAdapter(appOptions) {
    return {
      createUser,
      getUser,
      getUserByEmail,
      getUserByProviderAccountId,
      // getUserByCredentials,
      updateUser,
      deleteUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSession,
      updateSession,
      deleteSession,
      // createVerificationRequest,
      // getVerificationRequest,
      // deleteVerificationRequest
    }
  }

  async function createUser(profile: User) {
    //console.log({ function: 'createUser', profile })
    return Users.createUser(profile)
  }
  
  async function getUser(id: string) {
    //console.log({ function: 'getUser', id })
    return Users.getUser(id)
  }
  
  async function getUserByEmail(email: string) {
    //console.log({ function: 'getUserByEmail', email })
    return Users.getUserByEmail(email)
  }
  
  async function getUserByProviderAccountId(
    providerId,
    providerAccountId
  ) {
    //console.log({ function: 'getUserByProviderAccountId', providerId, providerAccountId })
    const accountDoc = await Accounts.getAccountByProviderAccountId(providerId, providerAccountId)
    //console.log({
    //   accountDoc
    // })
    if (!accountDoc) {
      return null
    }
    return Users.getUser(accountDoc.userId)
  }
  
  // async function getUserByCredentials(credentials) {
  //console.log({ function: 'getUserByCredentials', credentials })
  //   return null
  // }
  
  async function updateUser(user) {
    //console.log({ function: 'updateUser', user })
    return Users.updateUser(user)
  }
  
  async function deleteUser(userId) {
    //console.log({ function: 'deleteUser', userId })
    return Users.deleteUserById(userId)
  }
  
  async function linkAccount(
    userId,
    providerId,
    providerType,
    providerAccountId,
    refreshToken,
    accessToken,
    accessTokenExpires
  ) {
    // console.log({
    //   function: 'linkAccount', userId,
    //   providerId,
    //   providerType,
    //   providerAccountId,
    //   refreshToken,
    //   accessToken,
    //   accessTokenExpires
    // })
    await Accounts.createAccount({
      userId,
      providerAccountId,
      providerId,
      providerType,
      refreshToken,
      accessToken,
      accessTokenExpires
    })
  }
  
  async function unlinkAccount(
    userId,
    providerId,
    providerAccountId
  ) {
    //console.log({ function: 'unlinkAccount', userId, providerId, providerAccountId })
    return Accounts.deleteAccountByProviderAccountId(providerId, providerAccountId)
  }
  
  async function createSession(user) {
    //console.log({ function: 'createSession', user })
    return Sessions.createSession(user)
  }
  
  async function getSession(sessionToken) {
    //console.log({ function: 'getSession', sessionToken })
    return Sessions.getSessionByToken(sessionToken)
  }
  
  async function updateSession(
    session,
    force
  ) {
    //console.log({ function: 'updateSession', session, force })
    return Sessions.updateSession(session, force)
  }
  
  async function deleteSession(sessionToken) {
    //console.log({ function: 'deleteSession', sessionToken })
    return Sessions.deleteSessionByToken(sessionToken)
  }
  
  // async function createVerificationRequest(
  //   identifier,
  //   url,
  //   token,
  //   secret,
  //   provider
  // ) {
  //console.log({
  //     function: 'createVerificationRequest', identifier,
  //     url,
  //     token,
  //     secret,
  //     provider
  //   })
  //   return null
  // }
  
  // async function getVerificationRequest(
  //   identifier,
  //   token,
  //   secret,
  //   provider
  // ) {
  //console.log({
  //     function: 'getVerificationRequest', identifier,
  //     token,
  //     secret,
  //     provider
  //   })
  //   return null
  // }
  
  // async function deleteVerificationRequest(
  //   identifier,
  //   token,
  //   secret,
  //   provider
  // ) {
  //console.log({
  //     function: 'deleteVerificationRequest', identifier,
  //     token,
  //     secret,
  //     provider
  //   })
  //   return null
  // }

  return {
    getAdapter
  }
}



export default {
  Adapter
}