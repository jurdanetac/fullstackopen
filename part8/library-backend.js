const { GraphQLError } = require("graphql");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

// import data models of Author and Book
const Author = require("./models/Author");
const Book = require("./models/Book");

// set up mongoose and connect to db
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

// fetch authors and books from server's db
let authors;
let books;

Author.find({}).then((result) => {
  authors = result;
});
Book.find({}).then((result) => {
  books = result;
});

// define schema and resolvers
const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;
const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (args.author && !args.genre) {
        return books.filter((book) => book.author === args.author);
      } else if (args.genre && !args.author) {
        const booksOfGenre = [];

        // each book
        books.forEach((book) => {
          // check if any of the genres of the book matches the query
          if (book.genres.includes(args.genre)) {
            booksOfGenre.push(book);
          }
        });

        return booksOfGenre;
      } else if (args.genre && args.author) {
        const booksOfGenreOfAuthor = [];

        // each book
        books.forEach((book) => {
          // check if any of the genres of the book matches the query
          if (book.author === args.author && book.genres.includes(args.genre)) {
            booksOfGenreOfAuthor.push(book);
          }
        });

        return booksOfGenreOfAuthor;
      } else {
        return books;
      }
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (root) =>
      books.filter((book) => book.author === root.name).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
          authors.concat(author);
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: author.name,
              error,
            },
          });
        }
      }

      const book = new Book({ ...args, author: author });

      // save book to db
      try {
        book.save().then((result) => {
          books = books.concat(result);
        });
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      // return added book
      return book;
    },
    editAuthor: async (root, args) => {
      const { name, setBornTo } = args;
      const author = await Author.findOne({ name: name });

      // checks both parameters were passend and the existence of such author
      if (!(name && setBornTo && author)) {
        return null;
      }

      // change birthyear of author
      author.born = setBornTo;
      // update local authors array
      authors = authors.map((a) => (a.name === name ? author : a));
      // persist changes to db
      return await author.save();
    },
  },
};

// set up server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
