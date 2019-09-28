export const initState = {
  login: '',
}

export type State = typeof initState

export enum Types {
  SET_USER,
}

type SetUserAction = {
  type: Types.SET_USER
  payload: { username: string }
}

export type Action = SetUserAction

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case Types.SET_USER:
      return { ...state, login: action.payload.username }
    default:
      return state
  }
}
