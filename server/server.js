import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  {
    id: "1",
    name: "vignesh",
    email: "vignesh@yopmail.com",
    age: 25,
    isMarried: false,
  },
  {
    id: "2",
    name: "prem",
    email: "prem@yopmail.com",
    age: 28,
    isMarried: true,
  },
  {
    id: "3",
    name: "senthil",
    email: "senthil@yopmail.com",
    age: 32,
    isMarried: true,
  },
];

const typeDefs = `
       type Query {
          getAllUsers: [User]
          getUserById(id:ID!): User
       }

       type Mutation {
           createNewUser(name:String!,email:String!,age:Int!,isMarried:Boolean!): User
       }

       type User {
        id: ID
        name: String
        email: String
        age: Int
        isMarried: Boolean
       }
`;

const resolvers = {
  Query: {
    getAllUsers: (parent, args) => {
      return users;
    },
    getUserById: (parent, args) => {
      return users.find((user) => user.id === args.id);
    },
  },
  Mutation: {
    createNewUser: (parent, args) => {
      const newUser = { ...args, id: String(users.length + 1) };
      users.push(newUser);
      return newUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`Server is running at ${url}`);
