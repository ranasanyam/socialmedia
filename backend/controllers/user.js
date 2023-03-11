const Post = require('../models/Post');
const User = require('../models/User');
const { sendEmail } = require('../middlewares/sendEmail');
const cloudinary = require('cloudinary');

exports.register = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        let user = await User.findOne({ email });
        
        if(user) return res.status(400).json({ success: false, message: 'User already exists.'});

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars'
        });


        user = await User.create({ name, email, password, avatar: { public_id: myCloud.public_id, url: myCloud.secure_url }});

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(201).cookie("token", token, options).json({
            success: true,
            user, 
            token
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        

        const user = await User.findOne({ email }).select('+password').populate("posts followers following");

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }
        const  token = await user.generateToken();
        

        const options = { 
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
            httpOnly: true
        };

        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
exports.logout = async (req, res) => {
    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
        .json({
            success: true,
            message: 'Logged out'
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
exports.followUser = async (req, res) => {
    try {
        console.log('function called');
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)) {
            const idxFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const idxFollowers = userToFollow.followers.indexOf(loggedInUser._id);


            loggedInUser.following.splice(idxFollowing, 1);
            userToFollow.followers.splice(idxFollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();
            res.status(200).json({
                success: true,
                message: "User Unfollowed"
            });
        } else {
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await userToFollow.save();


            res.status(200).json({
                success: true,
                message: "User followed"
            });
        }
        
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;
        
        if(!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide old and new password!"
            });
        }
        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Old Password"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Update"
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const { name, email, avatar } = req.body;
        if(!name && !email) {
            return res.status(400).json({
                success: false,
                message: "Please provide name or email!"
            });
        }
        if(name) {
            user.name = name;
        } 
        if(email) {
            user.email = email;
        }
        if(avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatar"
            });
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated"
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        //removing photos from cloudinary

        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        await User.deleteOne({_id: req.user._id});

        // logout user after deleting profile
        res.cookie("token", null, { 
            expires: new Date(Date.now()), 
            httpOnly: true 
        });
        
        // deleting all posts of the user
        for(let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await Post.deleteOne({_id: post._id});
        }
        // removing user from followers following

        for(let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);
            const idx = follower.following.indexOf(userId);
            follower.following.splice(idx, 1);
            await follower.save();
        }

        // removing user from following's followers
        for(let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);
            const idx = follows.followers.indexOf(userId);
            follows.followers.splice(idx, 1);
            await follows.save();
        }

        // removing all comments of the user from all posts

        const allPosts = await Post.find();

        for(let i=0;i<allPosts.length;i++) {
            const post = await Post.findById(posts[i]._id);

            for(let j=0;j<post.comments.length;j++) {
                if(post.comments[j].user === userId) {
                    post.comments.splice(j,1);
                }
            }
            await post.save();
        }

        // removing all likes of the user from all posts
        for(let i=0;i<allPosts.length;i++) {
            const post = await Post.findById(allPosts[i]._id);

            for(let j=0;j<post.likes.length;j++) {
                if(post.likes[j] === userId) {
                    post.likes.splice(j, 1);
                }
            }
            await post.save();
        }
        res.status(200).json({
            success: true,
            message: "Profile Deleted"
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('posts followers following');

        res.status(200).json({
            success: true,
            user
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts followers following');

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.query.name, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            users
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = [];


        for(let i=0;i<user.posts.length;i++) {
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner");
            posts.push(post);
        }
        res.status(200).json({
            success: true,
            posts
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
exports.getUserPosts = async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id);
        const posts = [];


        for(let i=0;i<user.posts.length;i++) {
            const post = await Post.findById(user.posts[i]).populate("likes comments.user owner");
            posts.push(post);
        }
        res.status(200).json({
            success: true,
            posts
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        console.log(req.body.email);
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }
        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetPasswordToken}`;

        const message = `Reset Your Password by clicking on the  link below: \n\n ${resetUrl}`;

        try {
            await sendEmail({ email: user.email, subject: 'Reset Password', message });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
            });
        } catch(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordToken = undefined;

            await user.save();

            res.status(500).json({
                success: false,
                message: err.message
            });
        }

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}