import React from 'react'
//
export const defaultState = {}

const defaultReducer = (old, newState) => newState

export const useTableState = (
  initialState = {},
  overrides,
  { reducer = defaultReducer, useState: userUseState = React.useState } = {}
) => {
  let [state, setState] = userUseState({
    ...defaultState,
    ...initialState,
  })

  const overriddenState = React.useMemo(() => {
    const newState = {
      ...state,
    }
    if (overrides) {
      Object.keys(overrides).forEach(key => {
        newState[key] = overrides[key]
      })
    }
    return newState
  }, [overrides, state])

  const overriddenStateRef = React.useRef()
  overriddenStateRef.current = overriddenState

  const reducedSetState = React.useCallback(
    (updater, type) => {
      return setState(old => {
        const newState = updater(old)
        return reducer(old, newState, type)
      })
    },
    [reducer, setState]
  )

  return React.useMemo(() => [overriddenState, reducedSetState], [
    overriddenState,
    reducedSetState,
  ])
}
