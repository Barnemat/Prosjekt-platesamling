export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_FILTER': {
      if (action.payload.filter) {
        return action.payload.filter;
      }

      const { groupName, tagName } = action.payload;
      return {
        ...state,
        [groupName]: {
          ...state[groupName],
          [tagName]: !state[groupName][tagName],
        },
      };
    }
    case 'RESET_FILTER': {
      return {};
    }
    default: {
      return state;
    }
  }
};
