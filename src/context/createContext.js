import { createContext, useContext } from "react"

export default (name) => {
  const ctx = createContext(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error(`${name} must be inside a Provider with a value`)
    return c
  }

  return [useCtx, ctx.Provider]
}
