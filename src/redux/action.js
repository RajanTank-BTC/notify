
export const addReminder = (data) => (dispatch, getState) => {
  return dispatch({ type: 'ADD_REMINDER', payload: data })
}

export const deleteReminder = (itemName) => (dispatch, getState) => {
  return dispatch({ type: 'DELETE_REMINDER', payload: itemName })
}