import { createSlice } from "@reduxjs/toolkit";

export const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversation: [],
  },
  reducers: {
    addConvo: (state, action) => {
      state.conversation.push(action.payload);
    },
  },
});

export const { addConvo } = conversationSlice.actions;
export const selectConversation = (state) => state.conversation.conversation;
export default conversationSlice.reducer;