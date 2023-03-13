import axios from 'axios';


export const loginUser = (email, password) => async (dispatch) => {

    try {
        dispatch({
            type: "loginRequest"
        });
        const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/login`, { email, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(data);
        dispatch({
            type: "loginSuccess",
            payload: data.user
        });
    } catch(err) {
        dispatch({
            type: "loginFailure",
            payload: err.response.data.message
        })
    }
}
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "loadUserRequest"
        });
        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/me`);
        dispatch({
            type: "loadUserSuccess",
            payload: data.user
        });
    } catch(err) {
        dispatch({
            type: "loadUserFailure",
            payload: err.response.data.message
        })
    }
}

export const getFollowingPosts = () => async (dispatch) => {
    try  {
        dispatch({
            type: "postOfFollowingRequest"
        });

        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/posts`);


        dispatch({
            type: 'postOfFollowingSuccess',
            payload: data.posts
        });

    } catch(err) {
        dispatch({
            type: "postOfFollowingFailure",
            payload: err.response.data.message
        });
    }
}

export const getAllUsers = (name="") => async (dispatch) => {
    try  {
        dispatch({
            type: "allUsersRequest"
        });

        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/users?name=${name}`);


        dispatch({
            type: 'allUsersSuccess',
            payload: data.users
        });

    } catch(err) {
        dispatch({
            type: "allUsersFailure",
            payload: err.response.data.message
        });
    }
}
export const getMyPosts = () => async (dispatch) => {
    try  {
        dispatch({
            type: "myPostsRequest"
        });

        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/my/posts`);


        dispatch({
            type: 'myPostsSuccess',
            payload: data.posts
        });

    } catch(err) {
        dispatch({
            type: "myPostsFailure",
            payload: err.response.data.message
        });
    }
}
export const logoutUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "logoutUserRequest"
        });
        await axios.get(`${process.env.REACT_APP_URL}/api/v1/logout`);
        dispatch({
            type: "logoutUserSuccess"
        });
    } catch(err) {
        dispatch({
            type: "logoutUserFailure",
            payload: err.response.data.message
        })
    }
}
export const registerUser = (name, email, password, avatar) => async (dispatch) => {
    try {
        dispatch({
            type: "registerRequest"
        });
        const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/register`, { name, email, password, avatar }, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        dispatch({
            type: "registerSuccess",
            payload: data.user
        });
    } catch(err) {
        dispatch({
            type: "registerFailure",
            payload: err.response.data.message
        })
    }
}
export const updateProfile = (name, email, avatar) => async (dispatch) => {
    try {
        dispatch({
            type: "updateProfileRequest"
        });
        const { data } = await axios.put(`${process.env.REACT_APP_URL}/api/v1/update/profile`, { name, email, avatar }, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        dispatch({
            type: "updateProfileSuccess",
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "updateProfileFailure",
            payload: err.response.data.message
        })
    }
}
export const updatePassword = (oldPassword, newPassword) => async (dispatch) => {
    try {
        dispatch({
            type: "updatePasswordRequest"
        });
        const { data } = await axios.put(`${process.env.REACT_APP_URL}/api/v1/update/password`, { oldPassword, newPassword }, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
        dispatch({
            type: "updatePasswordSuccess",
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "updatePasswordFailure",
            payload: err.response.data.message
        })
    }
}
export const deleteMyProfile = () => async (dispatch) => {
    try {
        dispatch({
            type: "deleteProfileRequest"
        });
        const { data } = await axios.delete(`${process.env.REACT_APP_URL}/api/v1/delete/me`);
        dispatch({
            type: "deleteProfileSuccess",
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "deleteProfileFailure",
            payload: err.response.data.message
        })
    }
}

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({
            type: "forgotPasswordRequest"
        });
        const { data } = await axios.post(`${process.env.REACT_APP_URL}/api/v1/forgot/password`, {
            email
        },{
            headers: {
                "Content-Type": "application/json"
            }
        });
        dispatch({
            type: "forgotPasswordSuccess",
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "forgotPasswordFailure",
            payload: err.response.data.message
        })
    }
}

export const resetPassword = (token, password) => async (dispatch) => {
    try {
        dispatch({
            type: "resetPasswordRequest"
        });
        const { data } = await axios.put(`${process.env.REACT_APP_URL}/api/v1/password/token/${token}`, {
            password
        },{
            headers: {
                "Content-Type": "application/json"
            }
        });
        dispatch({
            type: "resetPasswordSuccess",
            payload: data.message
        });
    } catch(err) {
        dispatch({
            type: "resetPasswordFailure",
            payload: err.response.data.message
        })
    }
}

export const getUserPosts = (id) => async (dispatch) => {
    try  {
        dispatch({
            type: "userPostsRequest"
        });

        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/userposts/${id}`);


        dispatch({
            type: 'userPostsSuccess',
            payload: data.posts
        });

    } catch(err) {
        dispatch({
            type: "userPostsFailure",
            payload: err.response.data.message
        });
    }
}

export const getUserProfile = (id) => async (dispatch) => {
    try  {
        dispatch({
            type: "userProfileRequest"
        });

        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/user/${id}`);


        dispatch({
            type: 'userProfileSuccess',
            payload: data.user
        });

    } catch(err) {
        dispatch({
            type: "userProfileFailure",
            payload: err.response.data.message
        });
    }
}
export const followAndUnfollowUser = (id) => async (dispatch) => {
    try  {
        dispatch({
            type: "followUserRequest"
        });

        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/v1/follow/${id}`);


        dispatch({
            type: 'followUserSuccess',
            payload: data.message
        });

    } catch(err) {
        dispatch({
            type: "followUserFailure",
            payload: err.response.data.message
        });
    }
}