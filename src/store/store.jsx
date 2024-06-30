import { configureStore } from '@reduxjs/toolkit';
import signinReducer from './signin-slice';
import signupReducer from './signup-slice';
import composeReducer from './compose-slice';
import getDataReducer from './getData-slice';
import getSentDataReducer from './getSentData-slice'

const store = configureStore({
  reducer: {
    signin: signinReducer,
    signup: signupReducer,
    compose: composeReducer,
    data: getDataReducer,
    getSentData: getSentDataReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['compose.editorState'],
        ignoredActions: ['compose/setEditorState'],
        ignoredActionPaths: ['meta.arg.editorState', 'payload.editorState'],
      },
    }),
});

export default store;