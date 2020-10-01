import React from 'react'
import { Button, makeStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Link } from 'react-router-dom'
import { OPTION } from '@/option'
import { Board } from '~redux/state/board/reducer'
import { FavoriteIcon } from '@/components'
import { css } from '@emotion/core'

export const BoardListItem: React.FC<{ data: Board }> = ({ data }) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const muiStyles = useStyles()
  const style = React.useMemo(() => boardState.getBackgroundStyle(data.id), [
    boardState.getBackgroundStyle,
    data
  ])

  return (
    <Button
      to={`${OPTION.PATH.BOARD}/${data.id}`}
      component={Link}
      fullWidth={true}
      variant="contained"
      className={`AppBoardListItem-root ${muiStyles['button-board']}`}
      onClick={() => {
        document.body.click()
      }}
    >
      <div style={style} className="button-board-bg"></div>
      {data.title}
      <FavoriteIcon favorite={data.favorite} />
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  'button-board': {
    fontWeight: 'bold',
    textAlign: 'left',
    position: 'relative',
    overflow: 'hidden',
    paddingLeft: 45,
    paddingRight: 30,
    '& .MuiButton-label': {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    '& .button-board-bg': {
      width: 38,
      height: '100%',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 0,
      left: 0
    },
    '& .MuiSvgIcon-root': {
      position: 'absolute',
      right: 5
    }
  }
}))

const styles = {
  favorite: css`
    position: absolute;
    right: 5px;
  `
}
