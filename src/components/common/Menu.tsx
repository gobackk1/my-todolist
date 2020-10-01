import React from 'react'
import { css } from '@emotion/core'
import { useEventListener } from '@/scripts/hooks'
import { Paper } from '@material-ui/core'
import { theme } from '@/styles'

/**
 * ボタンと中身を渡してメニューを作成するコンポーネント
 * Menu が閉じた時に、onMenuClose イベントを発火させる
 * Menu コンポーネントが増えた時は、new CustomEvent('onMenuClose', { detail }) にする
 */
export const Menu: React.FC<Props> = ({ children, render }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuInnerRef = React.useRef(null)
  const openButtonRef = React.useRef(null)

  /**
   * ボードリストの外側をクリックしたらリストを閉じる
   * 内側と判定する要素は、[data-click-area="menu"] で囲む
   */
  const onClickOffMenuList = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('[data-click-area="menu"]')) return
    toggleMenu(false)
  }
  useEventListener('click', onClickOffMenuList)

  /**
   * 他のメニューが開いたら、このメニューを閉じる
   */
  const onMenuOpen = () => {
    toggleMenu(false)
  }
  useEventListener('onMenuOpen', onMenuOpen)
  useEventListener('onMenuArchived', onMenuOpen)

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
      isOpen
        ? dispatchEvent(new CustomEvent('onMenuClose'))
        : dispatchEvent(new CustomEvent('onMenuOpen'))
      setIsOpen(!isOpen)
    }

    if (typeof status === 'boolean') {
      status
        ? dispatchEvent(new CustomEvent('onMenuOpen'))
        : dispatchEvent(new CustomEvent('onMenuClose'))
      setIsOpen(status)
    }
  }

  return (
    <div css={styles['menu']}>
      <div data-click-area="menu">
        {render({
          ...providingProps
        })}
        <div
          css={styles['menu-inner']}
          ref={menuInnerRef}
          style={{
            display: isOpen ? 'block' : 'none'
          }}
          data-not-closed="true"
        >
          <Paper elevation={5}>{children}</Paper>
        </div>
      </div>
    </div>
  )
}

const styles = {
  menu: css`
    position: relative;
    z-index: ${theme.zIndex.menu};
  `,
  'menu-inner': css`
    position: absolute;
    border-radius: ${theme.borderRadius(1)}px;
  `
}

type Props = {
  render: (props: any) => JSX.Element
}
