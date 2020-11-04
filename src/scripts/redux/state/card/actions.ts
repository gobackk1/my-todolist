import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import { OPTION } from '@/option'
import firebase from 'firebase'
import { Card } from '~redux/state/card/reducer'

export const createCard = asyncActionCreator<
  Pick<Card, 'title' | 'listId'>,
  Pick<Card, 'title' | 'listId'> & { id: string },
  Error
>('CREATE_CARD', async params => {
  const { user } = store.getState().currentUser

  if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

  const { id } = await firebase
    .firestore()
    .collection(`users/${user.uid}/lists/${params.listId}/cards`)
    .add(params)

  return { id, ...params }
})

export const updateCard = asyncActionCreator<
  Pick<Card, 'title' | 'id' | 'listId'>,
  Pick<Card, 'title' | 'id' | 'listId'>,
  Error
>('UPDATE_CARD', async params => {
  const { user } = store.getState().currentUser

  if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

  const { listId, title, id } = params

  const documentReference = await firebase
    .firestore()
    .collection(`users/${user.uid}/lists/${listId}/cards`)
    .doc(id)

  documentReference.set({ title }, { merge: true })
  return params
})

export const deleteCard = asyncActionCreator<
  Pick<Card, 'id' | 'listId'>,
  Pick<Card, 'id' | 'listId'>,
  Error
>('DELETE_CARD', async params => {
  const { user } = store.getState().currentUser

  if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

  await firebase
    .firestore()
    .collection(`users/${user.uid}/lists/${params.listId}/cards`)
    .doc(params.id)
    .delete()

  return params
})

export const setCard = actionCreator<Card>('SET_CARD')
