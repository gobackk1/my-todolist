import { asyncActionCreator, actionCreator } from '~redux/action'
import { CurrentUserState } from '@/scripts/redux/state/currentUser/reducer'
import { store } from '~redux/store'
import { OPTION } from '@/option'
import firebase from 'firebase'
import { Card } from '~redux/state/card/reducer'

// crud できるまで書く

// export const fetchCard = asyncActionCreator<
//   Pick<List, 'boardId'>,
//   List[][],
//   Error
// >('FETCH_LIST', async ({ boardId }) => {
//   const { user }: CurrentUserState = store.getState().user
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
    const { user }: CurrentUserState = store.getState().user

    if (!user) {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }

    try {
      const { id } = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists/${listId}/cards`)
        .add({ title, listId })

      return { id, title, listId }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  }
)

export const updateCard = asyncActionCreator<
  Pick<Card, 'title' | 'id' | 'listId'>,
  Pick<Card, 'title' | 'id' | 'listId'>,
  Error
>('UPDATE_CARD', async ({ listId, title, id }) => {
  const { user }: CurrentUserState = store.getState().user

  if (user && user.uid) {
    try {
      const documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists/${listId}/cards`)
        .doc(id)

      documentReference.set({ title }, { merge: true })
      return { id, title, listId }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const deleteCard = asyncActionCreator<
  Pick<Card, 'id' | 'listId'>,
  Pick<Card, 'id' | 'listId'>,
  Error
>('DELETE_CARD', async ({ listId, id }) => {
  const { user }: CurrentUserState = store.getState().user

  if (user && user.uid) {
    try {
      await firebase
        .firestore()
        .collection(`users/${user.uid}/lists/${listId}/cards`)
        .doc(id)
        .delete()

      return { id, listId }
    } catch (e) {
      console.log(e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const addCard = actionCreator<any>('ADD_CARD')
export const setCards = actionCreator<any>('SET_CARDS')
