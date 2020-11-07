import React from 'react'
import { useParams } from 'react-router-dom'
import * as I from '@/scripts/model/interface'
import { useDispatch, useSelector } from 'react-redux'
import { updateBoard } from '~redux/state/board/actions'
import { css } from '@emotion/core'
import { theme } from '@/styles'
import { OPTION } from '@/option'

export const DrawerSelectBg: React.FC<{
  open: boolean
  setOpen: React.Dispatch<any>
}> = () => {
  const { boardId } = useParams<I.UrlParams>()
  const { boards } = useSelector(state => state.board)
  const dispatch = useDispatch()

  const currentBoard = React.useMemo(() => boards[boardId], [boards, boardId])

  const handleClick = React.useCallback(
    (backgroundImage: string) => {
      dispatch(updateBoard({ ...currentBoard, backgroundImage }))
    },
    [dispatch, currentBoard]
  )

  return (
    <ul>
      {OPTION.BOARD.BG.PHOTO.map(({ src, alt }, i) => (
        <li css={style['list-item']} key={i}>
          <button onClick={() => handleClick(src)}>
            <img src={src} alt={alt} css={style['list-item-img']} />
          </button>
        </li>
      ))}
      {OPTION.BOARD.BG.COLORS.map((color, i) => (
        <li css={style['list-item']} key={i}>
          <button onClick={() => handleClick(color)}>
            <div css={style['list-item-img']} style={{ backgroundColor: color }}></div>
          </button>
        </li>
      ))}
    </ul>
  )
}

const style = {
  'list-item': css`
    display: inline-block;
    width: 50%;
    padding: 0 4px 8px;

    button {
      border-radius: ${theme.borderRadius(1)}px;
    }
  `,
  'list-item-img': css`
    width: 133px;
    height: 95px;
    object-fit: cover;
    border-radius: ${theme.borderRadius(1)}px;
    max-width: 100%;
  `
}
