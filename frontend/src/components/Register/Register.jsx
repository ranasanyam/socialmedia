import { Avatar, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import { registerUser } from '../../actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';


const Register = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');

    const { loading, error } = useSelector((state) => state.user);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(registerUser(name, email, password, avatar));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();

        Reader.onload = () => {
            if(Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        }
        Reader.readAsDataURL(file);
    }

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
    }, [error, dispatch, alert]);


    return (
        <div className='register'>
            <form className="registerForm" onSubmit={submitHandler}>
                <Typography variant='h3' style={{ padding: '2vmax'}} >
                    Social App
                </Typography>
                <Avatar src={avatar} alt="User" sx={{ height: '10vmax', width: '10vmax'}} />
                <input 
                type="file"
                accept='image/*'
                onChange={handleImageChange}
                />
                <input 
                type="text"
                placeholder='Name'
                className='registerInputs'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />

                <input 
                type="email"
                placeholder='Email'
                className='registerInputs'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder="Password"
                className='registerInputs'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <Link to="/">
                    <Typography>Already Signed Up? Login  Now</Typography>
                </Link>
                <Button type="submit" disabled={loading} >Sign Up</Button>
            </form>
        </div>
    )
}

export default Register;