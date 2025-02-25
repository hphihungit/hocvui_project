import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import error from "jsonwebtoken/lib/JsonWebTokenError.js";

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 6
        const startIndex = (Number(page) - 1) * LIMIT // get the starting index of every page
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// QUERY -> /posts?page=1 -> page = 1
// PARAMS -> /posts/123 -> id = 123

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;

    try {
        const title = new RegExp(searchQuery, 'i') // test Test TEST => test

        const posts = await PostMessage.find({$or: [{title}, {tags: {$in: tags.split(',')}}]})

        res.json({ data: posts })
    } catch (e) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body
    console.log(post); // In dữ liệu nhận từ client

    const newPost = new PostMessage({
        ...post,
        creator: req.userId,
        selectedFile: post.selectedFile ? post.selectedFile.base64 : '', // Chỉ lưu base64 của ảnh
        createdAt: new Date().toISOString()
    })

    try {
        await newPost.save();

        res.status(201).json(newPost)
    } catch (error) {
        console.log(error); // In chi tiết lỗi ra console
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req, res) => {
    const {id: _id} = req.params;
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});

    res.json(updatePost);
}

export const deletePost = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndDelete(id)
    console.log('DELETE')

    res.json({message: 'Post deleted successfully'})
}

export const likePost = async (req, res) => {
    const {id} = req.params

    if (!req.userId) return res.json({message: 'Không thể xác thực'})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
        // like the post
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatePost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    res.json(updatePost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)

    post.comments.push(value)

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    res.json(updatedPost);
}