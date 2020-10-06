import React from 'react'
import { useSelector } from 'react-redux'
import { BoardRole } from '~redux/state/board/reducer'

interface BoardAuthorization {
  isOneOfRoles: (roles: BoardRole[]) => boolean
  getRole: (uid: string) => BoardRole
  loginUserRole: BoardRole | null
  isAuthor: (uid: string) => boolean
}

/**
 * ボード操作の認可に関わる関数群を提供するカスタムフック
 */
export const useBoardAuthority = (boardId: string): BoardAuthorization => {
  const { user } = useSelector(state => state.currentUser)
  const boardState = useSelector(state => state.board)

  const boardMembers = React.useMemo(() => {
    if (!boardState.init) return null
    return boardState.boards[boardId].members
  }, [boardState, boardId])

  const isOneOfRoles = React.useCallback(
    roles => {
      if (!user || !boardMembers) return
      return roles.includes(boardMembers[user.uid].role)
    },
    [boardMembers, user]
  )

  const getRole = React.useCallback(
    uid => boardState.boards[boardId].members[uid].role,
    [boardState.boards, boardId]
  )

  const loginUserRole = React.useMemo(() => {
    if (!user || !boardState.init) return null
    return boardState.boards[boardId].members[user.uid].role
  }, [boardState, user, boardId])

  const isAuthor = React.useCallback(
    uid => uid === boardState.boards[boardId].author,
    [boardState.boards, boardId]
  )

  return { isOneOfRoles, getRole, loginUserRole, isAuthor }
}
