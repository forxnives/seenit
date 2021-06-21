const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose')
require('dotenv').config();


async function startServer() {

    const DATABASE_URL = process.env.DATABASE_URL;

    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    });

    await apolloServer.start()

    apolloServer.applyMiddleware({app: app, path: '/gql'});

    app.use((req, res) => {
        res.send("Hello from express apollo server")
    });


    await mongoose.connect(DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log('Mongoose is connected...')

    app.listen(process.env.PORT || 4000, () => console.log("Server is running on port 4000"))


}

startServer();