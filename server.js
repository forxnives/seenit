const express = require('express')
const {ApolloServer, gql} = require('apollo-server-express')
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose')








async function startServer() {

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

    await mongoose.connect("mongodb+srv://SeenitAdmin:RsMur97rE6LMuWC@cluster0.fhus6.mongodb.net/seenItDB?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log('Mongoose is connected...')

    app.listen(4000, () => console.log("Server is running on port 4000"))


}

startServer();