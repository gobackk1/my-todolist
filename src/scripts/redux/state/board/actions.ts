import firebase from '@/scripts/firebase'
import { asyncActionCreator } from '~redux/action'
import * as I from '@/scripts/interfaces'

export const asyncSetTitle = asyncActionCreator<any, any, any>(
  'ASYNC_SET_TITLE',
  async (params, dispatch, getState) => {
    const { user } = (getState() as I.ReduxState).user
    if (user && user.uid) {
      const response = await firebase
        .firestore()
        .collection(`users/${user.uid}/title`)
        .add({ title: params })
      console.log('response', response)
      return ''
    }
  }
)
