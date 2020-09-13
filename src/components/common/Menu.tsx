import React from 'react'
import { css } from 'emotion/macro'
import { useEventListener } from '@/scripts/hooks'
import { OPTION } from '@/option'

/**
 * ボタンと中身を渡してメニューを作成するコンポーネント
 * Menu が閉じた時に、onMenuClose イベントを発火させる
 * Menu コンポーネントが増えた時は、new CustomEvent('onMenuClose', { detail }) にする
 */
export const Menu: React.FC<Props> = ({ children, render }) => {
  const [isOpen, setIsOpen] = React.useState(true)
  const menuInnerRef = React.useRef(null)
  const openButtonRef = React.useRef(null)

  /**
   * ボードリストの外側をクリックしたらリストを閉じる
   * 内側と判定する要素は、js-menu-click-area で囲む
   */
  const onClickOffMenuList = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('.js-menu-click-area')) return
    toggleMenu(false)
  }
  useEventListener('click', onClickOffMenuList)

  /**
   * render に渡ってきたボタンに props を付与する
   */
  const providingProps = {
    onClick: () => {
      toggleMenu()
    },
    ref: openButtonRef
  }

  const toggleMenu = (status?: boolean) => {
    // NOTE: 省略した時は toggle
    if (typeof status === 'undefined') {
      if (isOpen) window.dispatchEvent(new CustomEvent('onMenuClose'))
      setIsOpen(!isOpen)
    }

    if (typeof status === 'boolean') {
      if (!status) window.dispatchEvent(new CustomEvent('onMenuClose'))
      setIsOpen(status)
    }
  }

  return (
    <div className={styles['menu']}>
      <div className="js-menu-click-area">
        {render({
          ...providingProps
        })}
        <div
          className={styles['menu-inner']}
          ref={menuInnerRef}
          style={{
            display: isOpen ? 'block' : 'none'
          }}
          data-not-closed="true"
        >
          {children}}}
        </div>
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
