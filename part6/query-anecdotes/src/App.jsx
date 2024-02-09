import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, voteAnecdote } from "./requests";

const App = () => {
  const sortAnecdotes = (anecdotes) => {
    return anecdotes.sort((a, b) => b.votes - a.votes);
  };

  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (votedAnecdote) => {
      console.log("voted anecdote", votedAnecdote);
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      const aux = anecdotes.filter(
        (anecdote) => anecdote.id !== votedAnecdote.id,
      );

      queryClient.setQueryData(
        ["anecdotes"],
        sortAnecdotes(aux.concat(votedAnecdote)),
      );
    },
  });

  const handleVote = (anecdote) => {
    console.log("anecdote", anecdote);
    voteMutation.mutate(anecdote);
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  if (isPending) {
    return <div>loading data...</div>;
  }

  if (isError) {
    console.log(error);
    return <div>anecdote service not available due to problems in server</div>;
  }

  // We can assume by this point that `isSuccess === true`
  const anecdotes = sortAnecdotes(data);

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
