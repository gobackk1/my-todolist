import React from 'react'
import { Menu } from '@/components'
import { Button } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/interfaces'

export const BoardMenu = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  return (
    <Menu
      render={props => (
        <Button {...props} color="inherit">
          ボード一覧
        </Button>
      )}
    >
      {boardState.boards &&
        boardState.boards.map((board, i) => {
          return (
            <div key={i}>
              <div>{board.id}</div>
              <div>{board.title}</div>
            </div>
          )
        })}
    </Menu>
  )
}
