const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
})

const Post = mongoose.model('post', postSchema)

module.exports = Post;