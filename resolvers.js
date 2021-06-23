const Post = require('./models/Post.model')
const Album = require('./models/Album.model')
const axios = require('axios');
const r = require('better-redddit');
const redditImageFetcher = require('reddit-image-fetcher');
const { isCompositeType } = require('graphql');


const resolvers = {

    Query: {

        getAlbums: async (parent, args, context, info) => {
            const albums = await Album.find()
            return albums
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


        deleteAlbum: async (parent, { id }, context, info) => {
            await Album.findByIdAndDelete(id)
            return "Album successfully deleted"
        },


        updateAlbum: async (parent, { id, albumInput, imgInputs }, context, info) => {

            const { title, description } = albumInput

            const album = await Album.findById(id)

            if (title) {
                album.title = title
            }

            if (description) {
                album.description = description
            }

            if (imgInputs) {

                for (let i=0; i<imgInputs.length; i++) {

                    let contained = false

                    for (let k=0; k<album.imgs.length; k++ ) {

                        if (album.imgs[k]?.id.includes(imgInputs[i]?.id)) {
                            // console.log('well dom')
                            contained = true

                            album.imgs[k] = {
                                ...album.imgs[k],
                                ...imgInputs[i]
                            }
                        }
                    }

                    if (!contained){
                        album.imgs.push(imgInputs[i])
                    }
                }
            }

            await album.save()
            return album
        }
    }
};

module.exports = resolvers;