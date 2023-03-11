import { configureStore } from '@reduxjs/toolkit';
import { likeReducer, myPostReducer, userPostReducer } from './reducers/post';
import { allUsersReducer, postOfFollowingReducer, userProfileReducer, userReducer } from './reducers/user';




const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer,
        myPosts: myPostReducer,
        userProfile: userProfileReducer,
        userPosts: userPostReducer
    }
});

export default store;