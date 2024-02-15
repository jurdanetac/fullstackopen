const _ = require("lodash");

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (fav, item) => (fav.likes >= item.likes ? fav : item);
  return blogs.reduce(reducer, {});
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);

  const result = _(authors) // wrap array with lodash
    .countBy() // get element:count object
    .entries() // convert to array of tuples
    .maxBy(_.last); // find the max using count which is second arg

  const topAuthor = {
    author: _.head(result),
    blogs: _.last(result),
  };

  return topAuthor;
};

const mostLikes = (blogs) => {
  const postsGroupedByAuthor = _(blogs)
    .groupBy((blog) => blog.author)
    .value();
  // console.log(postsGroupedByAuthor);

  const likesByAuthor = [];

  Object.keys(postsGroupedByAuthor).forEach((key) => {
    const totalCount = _.sumBy(postsGroupedByAuthor[key], "likes");
    likesByAuthor.push({ author: key, likes: totalCount });
    // console.log(key, totalCount);
  });

  return favoriteBlog(likesByAuthor);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
