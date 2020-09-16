export interface SnackPack {
  message: string
  key?: number
  type: 'info' | 'error' | 'success' | 'warning'
}
