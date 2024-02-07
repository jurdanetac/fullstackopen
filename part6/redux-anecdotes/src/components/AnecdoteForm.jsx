import { createAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch, useSelector } from "react-redux";
import { notificationChange } from "../reducers/notificationReducer";
import { useEffect } from "react";

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  // clear notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(notificationChange(null));
    }, 5000);
    return () => clearTimeout(timer);
  }, [dispatch, notification]);

  const addAnecdote = (event) => {
    // prevent refresh
    event.preventDefault();

    // get the content of the input field
    const content = event.target.anecdote.value;

    // flush the input field
    event.target.anecdote.value = "";

    // dispatch the actions
    dispatch(createAnecdote(content));
    dispatch(notificationChange(`you created '${content}'`));
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
