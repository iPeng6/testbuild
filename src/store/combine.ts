// combine state & types & reducers
import * as globalM from './modules/global'
import * as todosM from './modules/todos'

export type State = globalM.State & {
  todosM: todosM.State
}

export const Types = {
  globalM: globalM.Types,
  todosM: todosM.Types,
}

export type Action = globalM.Action | todosM.Action

export const combineState: State = {
  ...globalM.initState,
  todosM: todosM.initState,
}

export function combineReducer(state: State, action: Action): State {
  return {
    ...globalM.reducer(state, action as globalM.Action),
    todosM: todosM.reducer(state.todosM, action as todosM.Action),
  }
}
