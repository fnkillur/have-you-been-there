const SET_USER_INFO = 'SET_USER_INFO' as const;

type User = {
  email: string;
  name: string;
};

export const setUserInfo = (user: User) => ({
  type: SET_USER_INFO,
  payload: user,
});

type userAction = ReturnType<typeof setUserInfo>;

type loginState = {
  email?: string;
  name?: string;
};

const initLoginState = {
  email: undefined,
  name: undefined,
};

function loginReducer(state: loginState = initLoginState, action: userAction) {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default loginReducer;
