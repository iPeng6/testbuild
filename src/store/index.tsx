import { useContext } from 'react'
import { combineState, combineReducer, Types } from './combine'
import createStore from './create'

export const { StateCtx, DispatchCtx, Provider } = createStore(combineState, combineReducer)

// hook for funciton component
export function useStore() {
  const state = useContext(StateCtx)
  const dispatch = useContext(DispatchCtx)
  return { state, dispatch, Types }
}

// 因为 dispatch 是始终不变的，当不依赖state的时，可以避免 rerender
export function useDispatch() {
  const dispatch = useContext(DispatchCtx)
  return { dispatch, Types }
}
