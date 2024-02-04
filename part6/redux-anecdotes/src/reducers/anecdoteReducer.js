const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  const anecdote = action.payload

  // print the action type and the anecdote sent to the reducer
  console.log(action.type, anecdote)

  switch (action.type) {
    case 'VOTE':
      // for each anecdote, if the id is not the same as the one voted, return
      // the anecdote as is else, return the anecdote with one more vote
      return state.map(a => a.id !== anecdote.id ? a : {...a, votes: a.votes + 1})
    case 'NEW':
      return [...state, asObject(anecdote.content)]
    default:
      // if the action type is not recognized, return the state as is
      return state
  }
}

export const vote = (anecdote) => {
  return {
    type: 'VOTE',
    payload: {...anecdote}
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'NEW',
    payload: {content}
  }
}

export default reducer
