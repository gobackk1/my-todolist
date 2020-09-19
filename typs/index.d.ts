declare global {
  namespace NodeJS {
    interface Global {
      __BROWSER__: any
    }
  }
}
