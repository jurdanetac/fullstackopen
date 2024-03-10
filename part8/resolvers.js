const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

// import data models of Author, Book and User
const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");

const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

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
        const books =
          args.genre === "all genres"
            ? await Book.find({})
            : await Book.find({ genres: args.genre });

        for (const book of books) {
          const author = await Author.findById(book.author);
          book.author = author;
        }

        return books;
      } else if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        const books =
          args.genre === "all genres"
            ? await Book.find({ author })
            : await Book.find({ author, genres: args.genre });

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
    bookCount: (root) => {
      return root.books.length;
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

      author = await Author.findOne({ name: args.author });
      author.books = author.books.concat(book);
      await author.save();

      // notify subscribers of added book
      pubsub.publish("BOOK_ADDED", { bookAdded: book });
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
