const Post = require('./models/Post.model')
const Album = require('./models/Album.model')
const axios = require('axios');
const r = require('better-redddit');
const redditImageFetcher = require('reddit-image-fetcher');
const { isCompositeType } = require('graphql');


const resolvers = {

    Query: {
        hello: () => {
            return 'Hello World';
        },

        getImgs: async (parent, { subreddits }, context, info) => {

            let allImgs = []

            for (let i = 0; i < subreddits.length; i++) {

                const subImgs = await redditImageFetcher.fetch({
                    type: 'custom',
                    total: 50,
                    subreddit: [`${subreddits[i]}`]
                });

                allImgs = [...allImgs, ...subImgs]
            }

            return allImgs.map(img => {

                return {
                    id: img.id,
                    title: img.title,
                    url: img.image,
                    date: img.createdUtc,
                    subreddit: img.subreddit
                }
            })
        },

        searchSubreddits: async (parent, { query, nsfw }, context, info) => {

            query = query.toLowerCase()

            let nsfwResults = []

            if (nsfw) {

                const nsfwListRaw = await axios.get('https://www.reddit.com/r/ListOfSubreddits/wiki/nsfw.json');
                const nsfwList = nsfwListRaw.data.data.content_md.split(`\r\n`)
                const nsfwArray = nsfwList.reduce((accumulator, item) => {
                    if (item.includes('/r/')) {
                        accumulator.push(item.trim().trim().slice(3).toLowerCase())
                    }
                    return accumulator
                }, [])

                nsfwArray.shift()

                nsfwResults = nsfwArray.filter(sub => (
                    sub.includes(query)
                ))
            }




            const rawResults = await axios.get(`https://www.reddit.com/subreddits/search.json?q=${query}`)
            const results = rawResults.data.data.children.reduce((accumulator, result) => {
                accumulator.push(result.data.display_name)
                return accumulator
            }, [])

            return [...nsfwResults, ...results]
        }
    },


    Mutation: {
        createPost: async (parent, args, context, info) => {
            const { title, description } = args.post;
            const post = new Post({ title, description })
            await post.save()
            return post
        },

        createAlbum: async (parent, { albumInput, imgInputs }, context, info) => {

            if (imgInputs) {
                const album = new Album({
                    ...albumInput,
                    imgs: imgInputs
                })
                await album.save()
                return album
            }

            const album = new Album({
                ...albumInput
            })
            await album.save()

            return album


        },

        deletePost: async (parent, { id }, context, info) => {
            await Post.findByIdAndDelete(id)
            return 'Post Deleted Successfully'
        },



        updatePost: async (parent, args, context, info) => {
            const { id } = args
            const updates = {}
            const { title, description } = args.post;

            if (title !== undefined) {
                updates.title = title
            }
            if (description !== undefined) {
                updates.description = description
            }

            const post = await Post.findByIdAndUpdate(
                id,
                updates,
                { new: true }
            );
            return post
        }
    }
};

module.exports = resolvers;

