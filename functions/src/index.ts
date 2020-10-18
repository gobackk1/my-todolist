import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'
import { HttpsError } from 'firebase-functions/lib/providers/https'
// const tools = require('firebase-tools')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://todolist-b51fb.firebaseio.com'
})

const db = admin.firestore

export const getUser = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const userRecord = await admin.auth().getUser(JSON.parse(data).uid)
    const { photoURL, uid, displayName } = userRecord
    return { photoURL, uid, displayName }
  })

export const getUserByEmail = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) return { error: 'Not authorized.' }
    try {
      const userRecord = await admin
        .auth()
        .getUserByEmail(JSON.parse(data).email)
      const { photoURL, uid, displayName } = userRecord
      return {
        data: {
          photoURL,
          uid,
          displayName
        }
      }
    } catch (error) {
      return { error }
    }
  })

export const onDeleteBoard = functions
  .region('asia-northeast1')
  .firestore.document('boards_archived/{boardId}')
  .onDelete(async (snap, context) => {
    const { boardId } = context.params
    const batch = db().batch()

    try {
      const snapshot = await db()
        .collection('relationships_favorite')
        .where('boardId', '==', boardId)
        .get()
      snapshot.forEach(doc => batch.delete(doc.ref))
      return batch.commit()
    } catch (error) {
      console.error('error occurred', error)
      throw new HttpsError('internal', 'internal server error')
    }
  })

export const onCreateUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async user => {
    const { uid, email } = user
    try {
      await db()
        .collection('user_detail_public')
        .doc(uid)
        .set({
          uid,
          displayName: 'デフォルトユーザー',
          email,
          profile: '',
          avatarURL: 'default'
        })
    } catch (error) {
      console.error('error occurred', error)
      throw new HttpsError('internal', 'internal server error')
    }
  })

export const onDeleteUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete(async user => {
    const { uid } = user
    try {
      await db()
        .collection('user_detail_public')
        .doc(uid)
        .delete()
    } catch (error) {
      console.error('error occurred', error)
      throw new HttpsError('internal', 'internal server error')
    }
  })
