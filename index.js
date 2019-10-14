const { ApolloServer, gql} = require('apollo-server');
const crypto = require('crypto');

const db = {
    users: [
        {id: '1', email: 'alex@gmail.com', name: 'alex', avatarURL: 'https://gravatar.com/...'},
        {id: '2', email: 'max@gmail.com', name: 'max', avatarURL: 'https://gravatar.com/...'},
        {id: '3', email: 'dan@gmail.com', name: 'dan', avatarURL: 'https://gravatar.com/...'}
    ], 
    messages: [
        {id: '1', userId: '1', body: 'Hello', createdAt: Date.now()},
        {id: '2', userId: '2', body: 'Ciao bella', createdAt: Date.now()},
        {id: '3', userId: '1', body: 'Howdy', createdAt: Date.now()},
    ]
}

// Schema
const typeDefs = gql`
    type Query {
        users: [User!]!
        user(id: ID!): User
        messages: [Message!]!
    }

    type Mutation {
        addUser(
            email: String!
            name: String 
            ): User
    }

    type User {
        id: ID!
        email: String!
        name: String
        avatarURL: String
        messages: [Message!]!
    }

    type Message {
        id: ID!
        body: String!
        createdAt: String
    }
`

// Resolvers
const resolvers = {
    // define all top level resolvers - basically anything in the root Query typeDef
    Query: {
        users: () => db.users,
        user: (root, { id }) => db.users.find(user => user.id === id),
        messages: () => db.messages, 
    }, 
    Mutation: {
        addUser: (root, { email, name }) => {
            const user = {
                id: crypto.randomBytes(10).toString('hex'),
                email,
                name
            }
    
            db.users.push(user)
            return user
        }
    },
    User: {
        // user is root - as method is call on user
        messages: user => db.messages.filter(message => message.userId === user.id)
    }

}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(url));