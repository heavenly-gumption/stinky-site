import firebaseAdmin from 'firebase-admin';
import 'firebase/firestore'

function getCredentials() {
    return {
        type: process.env.TYPE,
        projectId: process.env.PROJECT_ID,
        privateKeyId: process.env.PRIVATE_KEY_ID,
        privateKey: process.env.PRIVATE_KEY,
        clientEmail: process.env.CLIENT_EMAIL,
        clientId: process.env.CLIENT_ID,
        authUri: process.env.AUTH_URI,
        tokenUri: process.env.TOKEN_URI,
        authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.CLIENT_X509_CERT_URL
    }
}

export function Database() {
    console.log("Calling Database")
    const credentials = getCredentials()
    const firebaseAdminApp = firebaseAdmin.apps.length ? firebaseAdmin.app() : firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(credentials),
        databaseURL: "https://stinky-database.firebaseio.com"
    })
    console.log("Firebase authenticated")
    return firebaseAdminApp.firestore()
}
