import React from 'react'
import { useParams } from 'react-router-dom'
import * as I from '@/scripts/model/interface'
import { useDispatch } from 'react-redux'
import { updateBoard } from '~redux/state/board/actions'

export const DrawerSelectBg: React.FC<{
  open: boolean
  setOpen: React.Dispatch<any>
}> = () => {
  const { boardId } = useParams<I.UrlParams>()
  const dispatch = useDispatch()

  const onClick = (backgroundImage: any) => {
    dispatch(updateBoard({ id: boardId, backgroundImage }))
  }

  return (
    <div>
      <button onClick={() => onClick('bg_photo_1')}>set bg1</button>
      <button onClick={() => onClick('bg_photo_2')}>set bg2</button>
    </div>
  )
}
