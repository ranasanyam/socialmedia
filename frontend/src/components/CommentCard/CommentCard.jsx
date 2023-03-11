import React from 'react';
import './CommentCard.css';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentOnPost } from '../../actions/post';
import { getFollowingPosts, getMyPosts } from '../../actions/user';



const CommentCard = ({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount
}) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const deleteCommentHandler = () => {
        dispatch(deleteCommentOnPost(postId, commentId));
        if(isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getFollowingPosts());
        }
    }
    return (
        <div className='commentUser'>
            <Link to={`/user/${userId}`}>
                <img src={avatar} alt={name} />
                <Typography style={{ minWidth: '6vmax'}}>{name}</Typography>
            </Link>
            <Typography>
                 {comment}
                {
                    isAccount ? <Button onClick={deleteCommentHandler}>
                        <Delete />
                    </Button> : userId === user._id ? (
                    <Button onClick={deleteCommentHandler}>
                        <Delete />
                    </Button> 
                    ) : null
                }
            </Typography>
        </div>
    )
};


export default CommentCard;