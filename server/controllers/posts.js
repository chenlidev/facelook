import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from 'fs';
import path from 'path';

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const {userId, description, picturePath, videoPath, audioPath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            videoPath,
            audioPath,
            likes: {},
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({message: err.message});
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

/* DELETE */
const deleteFiles = (files) => {
    files.forEach((file) => {
        if (file) {
            const filePath = path.join('public', 'assets', file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete local file: ${filePath}`, err);
                } else {
                    console.log(`Successfully deleted local file: ${filePath}`);
                }
            });
        }
    });
};

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json({message: "Post not found"});
            return;
        }

        // Delete post from the database
        await Post.findByIdAndDelete(id);

        // Now, delete associated files
        const filesToDelete = [post.picturePath, post.videoPath, post.audioPath];
        deleteFiles(filesToDelete.filter(Boolean)); // Filter out any undefined or null paths

        res.status(200).json({message: "Post and associated files deleted successfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};