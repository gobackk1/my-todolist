import React from 'react'
import { useEventListener } from '@/scripts/hooks'
import { Paper } from '@material-ui/core'
import { theme } from '@/styles'
import { makeStyles } from '@material-ui/styles'

/**
 * ボタンと中身を渡してメニューを作成するコンポーネント
 * Menu が閉じた時に、menu_close イベントを発火させる
 * Menu コンポーネントが増えた時は、new CustomEvent('menu_close', { detail }) にする
 */
export const Menu: React.FC<Props> = ({ children, render, className }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuInnerRef = React.useRef(null)
  const openButtonRef = React.useRef(null)
  const styles = useStyles()

  /**
   * ボードリストの外側をクリックしたらリストを閉じる
   * 内側と判定する要素は、[data-click-area="menu"] で囲む
   *
   * 追記:
   * この機能は MUI の API として提供されているものがあったので書き換える
   * https://material-ui.com/api/click-away-listener/#clickawaylistener-api
   */
  const onClickOffMenuList = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('[data-click-area="menu"]')) return
    toggleMenu(false)
  }
  useEventListener('click', onClickOffMenuList)

  /**
   * 他のメニューが開いたら、このメニューを閉じる
   */
  const closeMenu = () => {
    toggleMenu(false)
  }

  useEventListener('menu_open', closeMenu)
  useEventListener('close_menu', closeMenu)

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
        ? dispatchEvent(new CustomEvent('menu_close'))
        : dispatchEvent(new CustomEvent('menu_open'))
      setIsOpen(!isOpen)
    }

    if (typeof status === 'boolean') {
      status
        ? dispatchEvent(new CustomEvent('menu_open'))
        : dispatchEvent(new CustomEvent('menu_close'))
      setIsOpen(status)
    }
  }

  return (
    <div className={`${className || ''} ${styles.root}`}>
      <div data-click-area="menu">
        {render({
          ...providingProps
        })}
        <div
          className="AppMenu-content"
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

const useStyles = makeStyles({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.menu,
    '& .AppMenu-content': {
      position: 'absolute',
      // boarderRadius: `${theme.borderRadius(0.5)}px`,
      transform: `translateY(${theme.spacing(0.5)}px)`
    }
  }
})

type Props = {
  render: (props: any) => JSX.Element
  className?: string
}
