type CustomEvent =
  //src/component/Menu が閉じた時
  | 'menu_close'
  //src/component/Menu が開いた時
  | 'menu_open'
  // src/component/Menu を閉じる依頼が dispatch された時
  | 'close_menu'

export const useCustomEvent = () => {
  return (event: CustomEvent) => dispatchEvent(new CustomEvent(event))
}
