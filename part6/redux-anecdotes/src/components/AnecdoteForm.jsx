import { createNewAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    // prevent refresh
    event.preventDefault();

    // get the content of the input field
    const content = event.target.anecdote.value;

    // flush the input field
    event.target.anecdote.value = "";

    dispatch(createNewAnecdote(content));
    dispatch(setNotification(`you created '${content}'`, 10));
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
