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
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args) => {
      if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author });
        const books = await Book.find({ author });

        for (book of books) {
          book.author = author;
        }

        return books;
      } else if (args.genre && !args.author) {
        const books = await Book.find({ genres: args.genre });

        for (book of books) {
          const author = await Author.findById(book.author);
          book.author = author;
        }

        return books;
      } else if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        const books = await Book.find({ author, genres: args.genre });

        for (book of books) {
          book.author = author;
        }

        return books;
      } else {
        const books = await Book.find({});

        for (book of books) {
          const author = await Author.findById(book.author);
          book.author = author;
        }

        return books;
      }
    },
    allAuthors: async () => await Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id });
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
