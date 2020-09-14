import React from 'react'
import { withStyles, makeStyles } from '@material-ui/styles'
import { Button, Theme } from '@material-ui/core'
import { useSnackbarContext, useEventListener } from '@/scripts/hooks'
import { Board as IBoard } from '~redux/state/board/reducer'
import { useParams } from 'react-router-dom'
import { OPTION } from '@/option'
import { updateBoard } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'

export const BoardTitle = () => {
  const [currentBoard, setCurrentBoard] = React.useState<IBoard | null>(
    {} as IBoard
  )
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const params = useParams<{
    boardId: string
  }>()
  const titleInputRef = React.useRef<HTMLInputElement>(null)
  const [isEditing, setEditing] = React.useState(false)
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()
  const styles = useStyles()

  /**
   * ボードタイトル変更 input 以外をクリックしたら、編集終了してタイトルを表示
   */
  useEventListener('click', (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('.js-title-area')) return
    if (isEditing) setEditing(false)
  })

  /**
   * 選択中のボードの情報を state で管理する
   */
  React.useEffect(() => {
    const current = boardState.boards.find(board => board.id === params.boardId)
    if (current) {
      setCurrentBoard(current)
    } else {
      setCurrentBoard(null)
    }
  }, [params, boardState, setCurrentBoard])

  React.useEffect(() => {
    if (!currentBoard) return
    titleInputRef.current!.value = currentBoard.title
  }, [currentBoard, isEditing])

  const updateBoardTitle = async (e: any) => {
    if (!currentBoard) return

    const title = e.target.value
    const { boardId: id } = params

    if (title === currentBoard.title) return
    if (title.length > 50) {
      showSnackbar({
        message: OPTION.MESSAGE.BOARD.TITLE.MAX_LENGTH_ERROR,
        type: 'error'
      })
      return
    } else if (!title.length) {
      showSnackbar({
        message: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
        type: 'error'
      })
      return
    }

    setEditing(false)

    try {
      await dispatch(updateBoard({ title, id }))
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  const onBlurTitleInput = (e: any) => {
    updateBoardTitle(e)
  }

  const onKeyDownTitleInput = (e: any) => {
    // NOTE: EnterKey以外はリターン
    if (e.keyCode !== 13) return
    updateBoardTitle(e)
  }

  const onClickTitle = () => {
    setEditing(true)
    resizeInput()

    // HACK: 非同期しないとテキストが選択状態にならない
    setTimeout(() => {
      titleInputRef.current!.focus()
      titleInputRef.current!.select()
    }, 0)
  }

  const onChange = () => {
    resizeInput()
  }

  const inputStyles = React.useMemo(() => {
    if (titleInputRef.current)
      return window.getComputedStyle(titleInputRef.current!)
    return null
    /**
     * FIXME:
     * react-hooks/exhaustive-deps で不必要な依存とされる
     * titleInputRef.current を取り除くと、inputStyles が常に null になる
     */
  }, [titleInputRef.current])

  const resizeInput = () => {
    const span = document.createElement('span')
    if (!inputStyles) return
    span.innerHTML = titleInputRef.current!.value
    span.style.padding = inputStyles.padding
    span.style.fontFamily = inputStyles.fontFamily
    span.style.fontSize = inputStyles.fontSize
    span.style.fontWeight = inputStyles.fontWeight
    span.style.letterSpacing = inputStyles.letterSpacing
    span.style.whiteSpace = 'nowrap'
    span.style.visibility = 'hidden'

    document.body.appendChild(span)
    const spanWidth = span.offsetWidth
    document.body.removeChild(span)
    titleInputRef.current!.style.width = `${spanWidth + 4}px`
  }

  return (
    <div className="js-title-area">
      {currentBoard ? (
        <div className={styles['root']}>
          <BoardTitleButton
            onClick={onClickTitle}
            style={{
              display: isEditing ? 'none' : 'block'
            }}
            className={styles['button']}
          >
            {currentBoard.title}
          </BoardTitleButton>
          <input
            name="title"
            type="text"
            ref={titleInputRef}
            onBlur={onBlurTitleInput}
            onKeyDown={onKeyDownTitleInput}
            onChange={onChange}
            className={`MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-outlined ${styles['input']}`}
            style={{
              display: isEditing ? 'block' : 'none'
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiButton-root': {
      minWidth: 150,
      width: 'auto',
      maxWidth: 'none',
      textAlign: 'left',
      textTransform: 'none',
      borderWidth: 2
    }
  },
  button: {
    '&.MuiButton-root': {
      padding: '4px 8px',
      border: '2px solid transparent',
      fontWeight: 'bold'
    }
  },
  input: {
    '&.MuiButton-outlined': {
      padding: '4px 8px',
      fontWeight: 'bold'
    }
  }
}))

const BoardTitleButton = withStyles({
  root: {
    backgroundColor: '#dedede'
  }
})(Button)
