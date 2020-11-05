import { createCard, setCard, updateCard, deleteCard } from './actions'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

// crud できるまで書く

export interface Card {
  title: string
  listId: string
  id: string
}

export interface cardState {
  isLoading: boolean
  error: Error | null
  cards: {
    [i: string]: Card
  }
  // lists: {
  //   [i: string]: {
  //     cards: Card[]
  //     // NOTE: カードに関してはアーカイブ機能を設けない予定
  //     // archivedCard: Card[]
  //   }
  // }
}

const initialState: cardState = {
  isLoading: false,
  error: null,
  cards: {}
}

export const cardReducer = reducerWithInitialState(initialState)
  .cases(
    [
      createCard.async.started,
      // fetchList.async.started,
      deleteCard.async.started,
      // archiveList.async.started,
      // fetchArchivedList.async.started,
      // restoreList.async.started,
      updateCard.async.started
    ],
    state => {
      return { ...state, isLoading: true }
    }
  )
  .cases(
    [
      createCard.async.failed,
      // fetchList.async.failed,
      deleteCard.async.failed,
      // archiveList.async.failed,
      // fetchArchivedList.async.failed,
      // restoreList.async.failed,
      updateCard.async.failed
    ],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .cases([createCard.async.done], (state, { result }) => {
    return {
      ...state,
      isLoading: false,
      cards: {
        ...state.cards,
        [result.id]: result
      }
    }
  })
  .case(updateCard.async.done, (state, { result }) => {
    return {
      ...state,
      isLoading: false,
      cards: {
        [result.id]: result
      }
    }
  })
  .case(deleteCard.async.done, (state, { result }) => {
    // TODO: より良い方法があれば書き換える
    /* eslint-disable-next-line */
    const { [result.id]: _, ...cardsWithoutTarget } = state.cards
    return {
      ...state,
      isLoading: false,
      cards: cardsWithoutTarget
    }
  })
  .case(setCard, (state, params) => {
    return {
      ...state,
      cards: {
        ...state.cards,
        [params.id]: params
      }
    }
  })
