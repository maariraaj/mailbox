import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EditorState } from 'draft-js';

export const sendMail = createAsyncThunk('compose/sendMail',
  async ({ to, subject, content }, { rejectWithValue }) => {
    try {
      const mailId = to.split(/[.@]/).join("");
      const senderMailId = localStorage.getItem('mailId');
      const response = await fetch(`https://mail-box-client-7-default-rtdb.firebaseio.com/${mailId}.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `${senderMailId}_${subject}_${Math.random().toString()}`,
          from: senderMailId,
          to,
          subject,
          content,
          read: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send mail');
      }
      console.log('Sent mail successfully');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const composeSlice = createSlice({
  name: 'compose',
  initialState: {
    to: '',
    subject: '',
    content: '',
    editorState: EditorState.createEmpty(),
    sending: false,
    error: null,
  },
  reducers: {
    setTo: (state, action) => {
      state.to = action.payload;
    },
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setEditorState: (state, action) => {
      state.editorState = action.payload;
    },
    resetCompose: (state) => {
      state.to = '';
      state.subject = '';
      state.content = '';
      state.editorState = EditorState.createEmpty();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMail.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMail.fulfilled, (state) => {
        state.sending = false;
        state.error = null;
      })
      .addCase(sendMail.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { setTo, setSubject, setContent, setEditorState, resetCompose } = composeSlice.actions;

export const selectCompose = (state) => state.compose;

export default composeSlice.reducer;