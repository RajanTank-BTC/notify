import { combineReducers } from 'redux'
const initialUserState = {
  reminders: []
}

const AddReminderReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_REMINDER': {
      return [
        ...state,
        action.payload
      ]
    }
    case 'DELETE_REMINDER': {
      let data = state.slice(0)
      data.splice(data.indexOf(data.filter(item => item.title === action.payload)[0]))
      return data
    }
    default: {
      return state;
    }
  }
};


const rootReducer = combineReducers({
  reminders: AddReminderReducer
})

export default rootReducer