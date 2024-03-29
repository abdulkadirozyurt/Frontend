import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import loginPhoto from '../images/loginimg.png'
import logoo from '../images/Group.png'
import logoPhoto from '../images/GroupImg.png'
import { Input, Form } from 'antd';

import { CheckCircleFilled } from '@ant-design/icons';

library.add(faEye, faEyeSlash);

function LoginPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ email: '', password: '' });

    const [isEmpty, setIsEmpty] = useState(true);

    const handleInputChange = (event) => {
        setUser((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));

    };

    const checkEmptyFields = () => {
        const userKeys = Object.keys(user);
        for (let key of userKeys) {
            if (!user[key]) {
                return true; // Eğer bir özellik boşsa, true döndür
            }
        }
        return false; // Eğer tüm özellikler doluysa, false döndür
    };
    const GetToken = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
        };

        await axios.get(`${process.env.REACT_APP_PORT}/auth/auth`, config)
            .then(response => {

                localStorage.setItem('userRole', response.data.role)
                navigate('/user/dashboard')

            })
            .catch(error => {
                console.error("error", error);
                alert("Kimlik doğrulama sırasında bir hata oluştu.");
            });
    };

    const HandleLogin = async () => {

        await axios.post(`${process.env.REACT_APP_PORT}/user/login`, { email: user.email, password: user.password }) // canlı ip si http://64.225.103.36:5001/user/login

            .then(response => {

                if (response.data.success) {
                    localStorage.setItem('userToken', response.data.accessToken)
                    localStorage.setItem('refreshToken', response.data.refreshToken)
                    alert(response.data.message)

                    setUser({ email: '', password: '' })

                    localStorage.getItem('userToken');
                    GetToken();
                    // } else if (response.data.message === 'E-posta veya şifre hatalı. Giriş yapılamadı.') {
                    //     // Eğer kullanıcı giriş yapamadıysa, refresh token ile yeni bir erişim token'ı al
                    //     refreshToken();
                } else {
                    alert(response.data.message);
                }
            });
    }

    useEffect(() => {
        setIsEmpty(checkEmptyFields());
    }, [user]);

    return (
        <div className='flex justify-center items-center'>
            <div className='loginPageDiv'>
                <div className='loginPageLeft'>
                    <img src={loginPhoto} className="bg-contain max-w-[666px] lg:block h-full lg:bg-left" />
                </div>
                <div className='loginPageRight'>
                    <div className='form'>
                        <div className='doneForgot'>
                            <CheckCircleFilled style={{ fontSize: '4.5rem', color: '#52C41A' }} />
                            <div className='doneText'>
                                <h1>Şifreniz Gönderildi!</h1>
                                <p style={{ marginBottom: '1.5rem' }}>Şifrenizi sıfırlamak için lütfen e-postanızı kontrol edin.</p>
                            </div>
                        </div>
                        <div className='input-buttons'>
                            <div className='back-login-button'>
                                <button onClick={() => { navigate('/login') }}>Giriş sayfasına geri dön</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='logo-image'>
                    <div className='logo'>
                        <img src={logoo} />
                    </div>
                    <div className='image'>
                        <img src={logoPhoto} />
                    </div>
                </div>
            </div>
        </div >
    );

}

export default LoginPage;