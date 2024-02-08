import { createSlice } from "@reduxjs/toolkit";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    vote(state, action) {
      // extract the id of the voted anecdote
      const { id } = action.payload;
      // increment the vote count of the anecdote with the given id by one
      state.find((anecdote) => anecdote.id === id).votes += 1;
    },
    createAnecdote(state, action) {
      // extract the content of the new anecdote from the action object
      const content = action.payload;
      // create a new anecdote object and add it to the state
      const newAnecdote = asObject(content);
      state.push(newAnecdote);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { vote, createAnecdote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
