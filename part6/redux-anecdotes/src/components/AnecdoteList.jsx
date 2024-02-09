import { useSelector, useDispatch } from "react-redux";
import { voteForAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  // anecdote content must contain filter
  const filter = useSelector((state) => state.filter);

  const allAnecdotes = useSelector((state) => state.anecdotes);

  // anecdotes with filter applied
  const anecdotes = allAnecdotes.filter((anecdote) =>
    anecdote.content.trim().toLowerCase().includes(filter.trim().toLowerCase()),
  );

  // function to dispatch actions
  const dispatch = useDispatch();

  const voteAnecdote = (anecdote) => {
    // notify user
    dispatch(setNotification(`you voted '${anecdote.content}'`, 10));
    // dispatch vote action
    dispatch(voteForAnecdote(anecdote));
  };

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
