import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./features/conversationSlice";

export default configureStore({
  reducer: {
    conversation: conversationReducer,
  },
});