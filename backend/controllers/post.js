const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('cloudinary');
const crypto = require('crypto');



exports.createPost = async (req, res) => {
    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "Post"
        });
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            owner: req.user._id
        }
        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.unshift(post._id);

        await user.save();


        res.status(201).json({
            success: true,
            message: 'Post created'
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
    
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        
  
        await cloudinary.v2.uploader.destroy(post.image.public_id);

        
    
        await Post.deleteOne({_id: req.params.id});


        const user = await User.findById(req.user._id);
        
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);

        await user.save();
        
    
        res.status(200).json({
            success: true,
            message: "Post deleted",
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            })
        }

        if(post.likes.includes(req.user._id)) {
            const idx = post.likes.indexOf(req.user._id);

            post.likes.splice(idx, 1);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            });

        } else {
            post.likes.push(req.user._id);

            await post.save();

            res.status(200).json({
                success: true,
                message: "Post Liked"
            });
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getPostOfFollowing = async (req, res) => {
    try {
        // const user = await User.findById(req.user._id).populate('following', 'posts');


        // res.status(200).json({
        //     success: true,
        //     posts: user.following
        // })

        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.following
            }
        }).populate("owner likes comments.user");

        res.status(200).json({
            success: true,
            posts: posts.reverse()
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!req.body.caption) {
            return res.status(400).json({
                success: false,
                message: "Please provide caption!"
            });
        }
        if(!post) {
            return res.status(404).json({
                success: false,
                message: 'Post Not found!'
            });
        }
        if(post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        post.caption = req.body.caption;
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Post Updated!'
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            res.status(404).json({
                success: false,
                message: "Post Not Found!"
            });
        }
        let commentIdx = -1;
    

        // checking if comment already exists
        post.comments.forEach((item, idx) => {
            if(item.user.toString() === req.user._id.toString()) {
                commentIdx = idx;
            }
        });
        if(commentIdx !== -1) {
            post.comments[commentIdx].comment = req.body.comment;

            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Comment Updated!'
            });
        } else {
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment
            });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Comment Added!"
            })
        }

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            res.status(404).json({
                success: false,
                message: "Post Not Found!"
            });
        }
        // checking if owner wants to delete
        if(post.owner.toString() === req.user._id.toString()) {
            if(req.body.commentId === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Comment Id is required"
                });
            }
            post.comments.forEach((item, idx) => {
                if(item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(idx, 1);
                }
            });
            await post.save();

            return res.status(200).json({
                success: true,
                message: "Selected Comment has deleted!"
            });
        } else {

            post.comments.forEach((item, idx) => {
                if(item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(idx, 1);
                }
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Your comment has deleted!"
            });
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpired: { $gt: Date.now() }
        });

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or has expired!"
            });
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpired = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password Udpated Successfully!'
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}