const mongoose = require('mongoose');

const imgSubSchema = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true
    },
    subreddit: {
        type: String,
        required: false
    }

})

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imgs: {
        type: [imgSubSchema],
        required: false
    }
})

const Album = mongoose.model('album', albumSchema)

module.exports = Album;