// combine state & reducers
import * as globalM from './modules/global'
import * as todosM from './modules/todos'

export type State = globalM.State & {
  todosM: todosM.State
}

export type Action = globalM.Action | todosM.Action

export let combineState: State = {
  ...globalM.initState,
  todosM: todosM.initState,
}

export function combineReducer(state: State, action: Action): State {
  return {
    ...globalM.reducer(state, action as globalM.Action),
    todosM: todosM.reducer(state.todosM, action as todosM.Action),
  }
}
