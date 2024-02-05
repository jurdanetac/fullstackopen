import { useSelector, useDispatch } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const state = useSelector((state) => state);

  const filter = state.filter;
  const anecdotes = state.anecdotes.filter((anecdote) =>
    anecdote.content.trim().toLowerCase().includes(filter.trim().toLowerCase()),
  );

  const dispatch = useDispatch();

  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => dispatch(vote(anecdote))}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
