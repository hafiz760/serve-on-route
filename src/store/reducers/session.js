import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token1: null,
  isLoggedIn: false,
  user: null,
  bool: false,
  notiId:null,
  address: {
    billing: {},
    shipping: {},
  },
  isVerified:false
};

const updateToken_ = (state, action) => {
  state.token1 = action.payload.token;
};
const updateNotiId_ = (state, action) => {
  state.notiId = action.payload;
};

const login_ = (state, action) => {
  state.isLoggedIn = true;
  // state.user = action.payload.user

  state.bool = true;
};

const verfied_=(state, action)=>{
  state.isVerified=true
}

const logout_ = (state, action) => {
  // return { ...initialState, token: state.token };
  return {
    token1: null,
    notiId:null,
    isLoggedIn: false,
    user: null,
    bool: false,
    address: {
      billing: {},
      shipping: {},
    },
  };
};

const logout1_ = (state, action) => {
  state.bool = false;
};

const updateUser_ = (state, action) => {
  state.user = action.payload;
};

const updateAddress_ = (state, action) => {
  state.address.billing = action.payload.billing || {};
  state.address.shipping = action.payload.shipping || {};
};

const slice = createSlice({
  name: "session",
  initialState: { ...initialState },
  reducers: {
    updateToken: updateToken_,
    updateNotiId: updateNotiId_,
    login: login_,
    logout: logout_,
    logout1: logout1_,
    updateUser: updateUser_,
    updateAddress: updateAddress_,
    verfied:verfied_
  },
});

const { actions, reducer } = slice;

export const {
  updateToken,
  login,
  updateNotiId,
  logout,
  logout1,
  updateUser,
  updateAddress,
  verfied,
} = actions;

export default reducer;

