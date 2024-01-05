const Filter = ({ search, onChange }) => {
  return (
    <p>
      filter shown with{" "}
      <input value={search} placeholder="search" onChange={onChange} />
    </p>
  );
};

export default Filter;
