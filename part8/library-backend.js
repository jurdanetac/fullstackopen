const { GraphQLError } = require("graphql");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");

// import data models of Author, Book and User
const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;
const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allAuthors: async () => await Author.find({}),
    allBooks: async (root, args) => {
      if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author });
        const books = await Book.find({ author });

        for (const book of books) {
          book.author = author;
        }

        return books;
      } else if (args.genre && !args.author) {
        const books = await Book.find({ genres: args.genre });

        for (const book of books) {
          const author = await Author.findById(book.author);
          book.author = author;
        }

        return books;
      } else if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        const books = await Book.find({ author, genres: args.genre });

        for (const book of books) {
          book.author = author;
        }

        return books;
      } else {
        const books = await Book.find({});

        for (const book of books) {
          const author = await Author.findById(book.author);
          book.author = author;
        }

        return books;
      }
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id });
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authorized", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          let errorMessage = "Saving author failed";

          if (author.name.length < 4) {
            errorMessage = "Author name must be at least 4 characters long";
          }

          throw new GraphQLError(errorMessage, {
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
        await book.save();
      } catch (error) {
        const doesBookExist = await Book.findOne({ title: args.title });
        let errorMessage = "Saving book failed";

        if (doesBookExist) {
          errorMessage = "Book already exists";
        }

        throw new GraphQLError(errorMessage, {
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
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authorized", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const { name, setBornTo } = args;
      const author = await Author.findOne({ name: name });

      // checks both parameters were passend and the existence of such author
      if (!(name && setBornTo && author)) {
        return null;
      }

      // change birthyear of author
      author.born = setBornTo;
      // persist changes to db
      return await author.save();
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
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
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
