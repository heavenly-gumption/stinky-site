import firebaseAdmin from 'firebase-admin';
import 'firebase/firestore'

function getCredentials() {
    const privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE_64, 'base64')
        .toString('utf-8')
        .replace(/\\n/g, '\n')
    //console.log(privateKey)
    return {
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
    }
}

export function Database() {
    //console.log("Calling Database")
    const credentials = getCredentials()
    const firebaseAdminApp = firebaseAdmin.apps.length ? firebaseAdmin.app() : firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(credentials),
        databaseURL: "https://stinky-database.firebaseio.com"
    })
    //console.log("Firebase authenticated")
    return firebaseAdminApp.firestore()
}
