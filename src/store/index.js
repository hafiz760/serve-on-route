// import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// import {
//   persistStore,
//   persistCombineReducers,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "@react-native-async-storage/async-storage";

// import reducers from "./reducers";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
//   whitelist: ["session", "setting"],
// };

// const persistedReducer = persistCombineReducers(persistConfig, reducers);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware({
//     serializableCheck: false,
//   }),
// });

// const persistor = persistStore(store);

// export { store, persistor };
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistCombineReducers,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@react-native-async-storage/async-storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["session", "setting"],
};

const persistedReducer = persistCombineReducers(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };


