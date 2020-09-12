import React from 'react'
import { Menu as MenuMui } from '@material-ui/core'
import { css } from 'emotion/macro'

/**
 * ボタンと中身を渡してメニューを作成するコンポーネント
 */
export const Menu: React.FC<Props> = ({ children, render }) => {
  const [
    anchorElement,
    setAnchorElement
  ] = React.useState<HTMLButtonElement | null>(null)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  return (
    <>
      {render({ onClick })}
      <MenuMui
        id="simple-menu"
        getContentAnchorEl={null}
        anchorEl={anchorElement}
        open={!!anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        {children}
      </MenuMui>
    </>
  )
}

const styles = {}

type Props = {
  render: (props: any) => JSX.Element
}
