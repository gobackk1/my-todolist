import { asyncActionCreator, actionCreator } from '~redux/action'
import { UserState } from '~redux/state/user/reducer'
import { store } from '~redux/store'
import { OPTION } from '@/option'
import firebase from 'firebase'
import { List } from '~redux/state/list/reducer'

// crud できるまで書く

// export const fetchCard = asyncActionCreator<
//   Pick<List, 'boardId'>,
//   List[][],
//   Error
// >('FETCH_LIST', async ({ boardId }) => {
//   const { user }: UserState = store.getState().user
//   let lists: List[] = []
//   // let archivedLists: List[] = []

//   if (user && user.uid) {
//     try {
//       const [listsReference, archivedListsReference] = await Promise.all([
//         firebase.firestore().collection(`users/${user.uid}/lists`),
//         firebase.firestore().collection(`users/${user.uid}/archivedLists`)
//       ])

//       const [snapshot, archivedSnapshot] = await Promise.all([
//         listsReference.where('boardId', '==', boardId).get(),
//         archivedListsReference.where('boardId', '==', boardId).get()
//       ])

//       if (snapshot.empty) lists = []
//       if (archivedSnapshot.empty) archivedLists = []

//       snapshot.forEach(doc => {
//         const { id } = doc
//         const { title } = doc.data()
//         lists.push({ boardId, id, title })
//       })
//       archivedSnapshot.forEach(doc => {
//         const { id } = doc
//         const { title } = doc.data()
//         archivedLists.push({ boardId, id, title })
//       })
//     } catch (e) {
//       throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
//     }

//     return [lists, archivedLists]
//   } else {
//     throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
//   }
// })

export const createCard = asyncActionCreator<any, any, Error>(
  'CREATE_CARD',
  async ({ title, listId }) => {
    const { user }: UserState = store.getState().user

    if (!(user && user.uid)) {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }

    try {
      await firebase
        .firestore()
        .collection(`users/${user.uid}/lists/${listId}/cards`)
        .add({ title, listId })

      return { title, listId }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  }
)

export const addCard = actionCreator<any>('ADD_CARD')
export const setCards = actionCreator<any>('SET_CARDS')
