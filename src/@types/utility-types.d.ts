type ValueOf<T, U extends keyof T> = T[U]
type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
