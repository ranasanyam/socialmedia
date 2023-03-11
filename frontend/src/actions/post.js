import axios from 'axios';


export const likePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: 'likeRequest'
        });

        const { data } = await axios.get(`/api/v1/post/${id}`);

        dispatch({
            type: 'likeSuccess',
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "likeFailure",
            payload: err.response.data.message
        });
    }
}

export const addCommentOnPost = (id, comment) => async (dispatch) => {
    try {
        dispatch({
            type: 'addCommentRequest'
        });

        const { data } = await axios.put(`/api/v1/post/comment/${id}`, {
            comment
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: 'addCommentSuccess',
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "addCommentFailure",
            payload: err.response.data.message
        });
    }
}
export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {
    try {
        dispatch({
            type: 'deleteCommentRequest'
        });

        const { data } = await axios.delete(`/api/v1/post/comment/${id}`, {
            data: { commentId }
        });

        dispatch({
            type: 'deleteCommentSuccess',
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "deleteCommentFailure",
            payload: err.response.data.message
        });
    }
}

export const createNewPost = (caption, image) => async (dispatch) => {
    try {
        dispatch({
            type: 'newPostRequest'
        });

        const { data } = await axios.post(`/api/v1/post/upload`, {
            caption,
            image
        }, {
            header: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: 'newPostSuccess',
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "newPostFailure",
            payload: err.response.data.message
        });
    }
}

export const updatePost = (caption, id) => async (dispatch) => {
    try {
        dispatch({
            type: 'updateCaptionRequest'
        });

        const { data } = await axios.put(`/api/v1/post/${id}`, {
            caption
        }, {
            header: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: 'updateCaptionSuccess',
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "updateCaptionFailure",
            payload: err.response.data.message
        });
    }
}
export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: 'deletePostRequest'
        });

        const { data } = await axios.delete(`/api/v1/post/${id}`);

        dispatch({
            type: 'deletePostSuccess',
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "deletePostFailure",
            payload: err.response.data.message
        });
    }
}