import React from 'react'
import { Menu, CreateBoardModal, ArchivedBoardModal } from '@/components'
import {
  Button,
  TextField,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { Link, useHistory } from 'react-router-dom'
import { OPTION } from '@/option'
import { css } from 'emotion/macro'

export const BoardListMenu: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const styles = useStyles()

  return (
    <Menu
      render={props => (
        <Button
          {...props}
          color="inherit"
          variant="contained"
          className={styles['buttonOpen']}
        >
          ボード一覧
        </Button>
      )}
    >
      <div className={CSS['menu-content']}>
        {boardState.boards &&
          boardState.boards.map((board, i) => {
            return (
              <div className={CSS['menu-content-item']} key={i}>
                <Button
                  to={`${OPTION.PATH.BOARD}/${board.id}`}
                  component={Link}
                  fullWidth={true}
                  variant="contained"
                  className={styles['buttonBoard']}
                >
                  {board.title}
                </Button>
              </div>
            )
          })}
        <CreateBoardModal />
        <ArchivedBoardModal />
      </div>
    </Menu>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonOpen: {
    padding: 0,
    backgroundColor: '#000',
    '&:hover': {
      backgroundColor: '#000'
    },
    '& .MuiButton-label': {
      padding: 5
    }
  },
  buttonBoard: {
    fontWeight: 'bold',
    textAlign: 'left',
    '& .MuiButton-label': {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
}))

const CSS = {
  'menu-content': css`
    background: #fff;
    padding: 20px;
    width: 300px;
    box-shadow: 2px 2px 13px 0px #6f6f6f;
  `,
  'menu-content-item': css`
    margin-bottom: 15px;
  `
}
