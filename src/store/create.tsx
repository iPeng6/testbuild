import React, { useReducer, createContext, FC } from 'react'

export default function createStore<S, T>(initialState: S, reducer: (state: S, action: T) => S) {
  const StateCtx = createContext(initialState)
  const DispatchCtx = createContext((() => {}) as React.Dispatch<T>)

  const Provider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <DispatchCtx.Provider value={dispatch}>
        <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
      </DispatchCtx.Provider>
    )
  }
  return { StateCtx, DispatchCtx, Provider }
}
