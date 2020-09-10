import React from 'react'
import { Redirect } from 'react-router-dom'
import { asyncSetTitle } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'

export const Board: React.FC = () => {
  const boardState = useSelector((state: any) => state.board)
  const dispatch = useDispatch()

  const onClick = () => {
    // dispatch(setTitle('newTitle'))
    dispatch(asyncSetTitle('asyncTitle'))
  }

  return (
    <div>
      {boardState.title}
      <button onClick={onClick}>test</button>
    </div>
  )
}
