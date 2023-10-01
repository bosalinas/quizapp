const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String
    email: String
    password: String
}
type Quiz {
    _id: ID!
    question: String!
    answers: [String]!
    correct_answer: String!
  }

type Auth {
    token: ID!,
    user: User
}
type Query {
    me: User
    users: [User]
    user(username: String!): User
    quizzes: [Quiz]
    quiz(ID: ID!): Quiz!
}
type Mutation { 
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
