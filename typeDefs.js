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

    type Post {
        id: ID
        title: String
        description: String
    }

    input PostInput {
        title: String
        description: String
    }

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
        hello: String
        searchSubreddits(query: String!, nsfw: Boolean = false): [String!]! 
        getImgs(subreddits: [String!]!): [Img!]!
        getAllPosts: [Post]
        getPost(id: ID): Post
    }

    type Mutation {
        createPost(post: PostInput): Post
        createAlbum(albumInput: AlbumInput! , imgInputs: [ImgInput]): Album
        deletePost(id: ID): String
        updatePost(id: ID, post: PostInput): Post
    }

`

module.exports = typeDefs;