const Post = require('./models/Post.model')

const resolvers = {
    Query: {
        hello: () => {
            return 'Hello World';
        },

        getAllPosts: async () => {
            return await Post.find();
        },

        getPost: async (parent, args, context, info) => {
            return await Post.findById(args.id)
        }
    },

    Mutation: {
        createPost: async (parent, args, context, info) => {
            const {title, description} = args.post;
            const post = new Post({title, description})
            await post.save()
            return post
        },

        deletePost: async (parent, {id}, context, info) => {
            await Post.findByIdAndDelete(id)
            return 'Post Deleted Successfully'
        },

        updatePost: async (parent, args, context, info) => {
            const {id} = args
            const updates = {}
            const { title, description } = args.post;

            if (title !== undefined){
                updates.title = title
            }
            if (description !==  undefined) {
                updates.description = description
            }

            const post = await Post.findByIdAndUpdate(
                id, 
                updates, 
                {new: true}
            );
            return post
        }
    }
};

module.exports = resolvers;

