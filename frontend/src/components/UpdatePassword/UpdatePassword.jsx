import React, { useState, useEffect } from 'react';
import './UpdatePassword.css';
import { Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../actions/user';
import { useAlert } from 'react-alert';


const UpdatePassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert()
    const { loading, error, message } = useSelector((state) => state.like);


    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updatePassword(oldPassword, newPassword));
    };

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
        if(message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }
    }, [error, dispatch, alert,  message]);
    return (
        <div className='updatePassword'>
            <form className='updatePasswordForm' onSubmit={submitHandler}>
                <Typography variant='h3'>Social App</Typography>

                <input 
                    type="password" 
                    placeholder='Old Password' 
                    required 
                    className='updatePasswordInputs'
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder='New Password' 
                    required 
                    className='updatePasswordInputs'
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                />

                <Button type='submit' disabled={loading}>Change Password</Button>

            </form>
        </div>
    )
};

export default UpdatePassword;