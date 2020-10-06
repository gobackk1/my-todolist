import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Link } from 'react-router-dom'
import { OPTION } from '@/option'
import { Board } from '~redux/state/board/reducer'
import { FavoriteIcon } from '@/components'

export const BoardListItem: React.FC<{
  data: Board
  variant?: 'bar' | 'block'
}> = ({ data, variant = 'bar' }) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const style = useStyles()
  const bg = React.useMemo(() => boardState.getBackgroundStyle(data.id), [
    boardState,
    data
  ])

  return (
    <Button
      to={`${OPTION.PATH.BOARD}/${data.id}`}
      component={Link}
      fullWidth={true}
      variant="contained"
      className={`AppBoardListItem-root ${style.root} ${variant === 'bar' &&
        style.bar} ${variant === 'block' && style.block}`}
      onClick={() => {
        document.body.click()
      }}
      style={variant === 'block' ? bg : {}}
    >
      <div style={bg} className="AppBoardListItem-bg"></div>
      {data.title}
      <FavoriteIcon favorite={data.favorite} />
    </Button>
  )
}

const useStyles = makeStyles({
  root: {
    fontWeight: 'bold',
    textAlign: 'left',
    position: 'relative',
    overflow: 'hidden',

    '& .MuiButton-label': {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    '& .AppBoardListItem-bg': {},
    '& .MuiSvgIcon-root': {
      position: 'absolute'
    }
  },
  bar: {
    paddingLeft: 45,
    paddingRight: 30,
    '& .MuiButton-label': {},
    '& .AppBoardListItem-bg': {
      width: 38,
      height: '100%',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 0,
      left: 0
    },
    '& .MuiSvgIcon-root': {
      right: 5
    }
  },
  block: {
    backgroundSize: 'cover',
    height: 100,
    alignItems: 'flex-start',
    '& .MuiButton-label': {
      color: '#fff',
      zIndex: 1
    },
    '& .AppBoardListItem-bg': {
      display: 'none'
    },
    '& .MuiSvgIcon-root': {
      right: 5,
      bottom: 5
    },
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      background: 'rgba(0, 0, 0, .2)',
      zIndex: 0
    }
  }
})
