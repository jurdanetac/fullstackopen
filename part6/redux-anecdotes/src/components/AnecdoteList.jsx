import { useSelector, useDispatch } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";
import { useEffect } from "react";

const AnecdoteList = () => {
  // get state from store
  const state = useSelector((state) => state);

  // anecdote content must contain filter
  const filter = state.filter;
  // anecdotes with filter applied
  const anecdotes = state.anecdotes.filter((anecdote) =>
    anecdote.content.trim().toLowerCase().includes(filter.trim().toLowerCase()),
  );

  // function to dispatch actions
  const dispatch = useDispatch();

  const voteAnecdote = (anecdote) => {
    // notify user
    dispatch(notificationChange(`you voted '${anecdote.content}'`));
    // dispatch vote action
    dispatch(vote(anecdote));
  };

  // clear notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(notificationChange(null));
    }, 5000);
    return () => clearTimeout(timer);
  }, [state.notification, dispatch]);

  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => voteAnecdote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
