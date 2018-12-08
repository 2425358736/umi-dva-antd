export default {
  namespace: 'globalVariable',

  state: {
    data: {
      layout: 1
    },
  },

  effects: {
    *updateType({ payload }, { put }) {
      console.log(payload)
      yield put({
        payload: payload,
        type: 'save',
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
