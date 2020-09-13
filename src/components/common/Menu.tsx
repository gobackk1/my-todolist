import React from 'react'
import { css } from 'emotion/macro'
import { useEventListener } from '@/scripts/hooks'
import { OPTION } from '@/option'

/**
 * ボタンと中身を渡してメニューを作成するコンポーネント
 */
export const Menu: React.FC<Props> = ({ children, render }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuInnerRef = React.useRef(null)
  const openButtonRef = React.useRef(null)

  /**
   * ボードリストの外側をクリックしたらリストを閉じる
   */
  const onClickOffMenuList = (e: Event) => {
    if (
      (e.target as HTMLElement).parentElement === menuInnerRef.current ||
      (e.target as HTMLElement).parentElement === openButtonRef.current
    ) {
      return
    }

    setIsOpen(false)
  }
  useEventListener('click', onClickOffMenuList)

  /**
   * render に渡ってきたボタンに props を付与する
   */
  const providingProps = {
    onClick: () => {
      setIsOpen(!isOpen)
    },
    ref: openButtonRef
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  /**
   * children からこのコンポーネントを閉じる為に、handleClose を提供する
   */
  const childrenWithProps = React.Children.map(children, child => {
    switch (typeof child) {
      case 'string':
        return child
      case 'object':
        return React.cloneElement(child as any, {
          handleClose
        })
      default:
        return null
    }
  })

  return (
    <div className={styles['menu']}>
      {render({ ...providingProps })}
      <div
        id="menu-inner"
        className={styles['menu-inner']}
        ref={menuInnerRef}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {childrenWithProps}}
      </div>
    </div>
  )
}

const styles = {
  menu: css`
    position: relative;
    z-index: ${OPTION.ELEVATION.MENU};
  `,
  'menu-inner': css`
    position: absolute;
  `
}

type Props = {
  render: (props: any) => JSX.Element
}
