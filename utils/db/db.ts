import firebaseAdmin from 'firebase-admin';
import 'firebase/firestore'

export function Database() {
    const firebaseAdminApp = firebaseAdmin.apps.length ? firebaseAdmin.app() : firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
        databaseURL: "https://stinky-database.firebaseio.com"
    })
    return firebaseAdminApp.firestore()
}
