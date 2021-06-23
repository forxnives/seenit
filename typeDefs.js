const { gql } = require('apollo-server-express')


const typeDefs = gql`



    type Img {
        id: ID!
        title: String!
        url: String!
        date: Int!  #created 
        subreddit: String
    }

    type Album {
        title: String!
        description: String
        imgs: [Img!]
    }



    #############################################


    input AlbumInput {
        title: String!
        description: String

    }

    input ImgInput {
        id: ID!
        title: String!
        url: String!
        date: Int!  #created
        subreddit: String
    }


    ##############################################

    type Query {

        searchSubreddits(query: String!, nsfw: Boolean = false): [String!]! 
        getAlbums: [Album!]!
        getImgs(subreddits: [String!]!): [Img!]!

    }

    type Mutation {

        createAlbum(albumInput: AlbumInput! , imgInputs: [ImgInput]): Album
        deleteAlbum(id: ID): String
        updateAlbum(id: ID, albumInput: AlbumInput!, imgInputs: [ImgInput]): Album
    }

`

module.exports = typeDefs;