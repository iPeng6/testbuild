export const initState = {
  todos: [] as Array<{ id: number; todo: string }>,
}

export type State = typeof initState

export enum Types {
  ADD_TODO,
  DEL_BY_ID,
}

type AddAction = {
  type: Types.ADD_TODO
  payload: { todo: string }
}

type DelAction = {
  type: Types.DEL_BY_ID
  payload: { id: number }
}

export type Action = AddAction | DelAction

let id = 0
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case Types.ADD_TODO:
      return { todos: state.todos.concat({ id: id++, todo: action.payload.todo }) }
    case Types.DEL_BY_ID:
      return { todos: state.todos.filter(({ id }) => id !== action.payload.id) }
    default:
      return state
  }
}
