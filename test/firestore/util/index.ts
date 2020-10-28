import * as firebase from '@firebase/rules-unit-testing'

type CreatRefParams = {
  uid?: string
  path: string
  docId?: string
}

export const PROJECT_ID = 'my-test-project'
export const RULES_PATH = 'firestore.rules'

export function createRef({ uid, path, docId }: CreatRefParams) {
  const auth = uid ? { uid } : undefined
  return createAuthApp(auth)
    .collection(path)
    .doc(docId)
}

export const createAuthApp = (auth?: object): firebase.firestore.Firestore => {
  if (typeof auth === 'undefined') {
    return firebase.initializeTestApp({ projectId: PROJECT_ID }).firestore()
  }
  return firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore()
}

export const createAdminApp = (): firebase.firestore.Firestore => {
  return firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore()
}
