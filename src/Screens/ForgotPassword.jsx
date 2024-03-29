import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import loginPhoto from '../images/loginimg.png'
import logoo from '../images/Group.png'
import logoPhoto from '../images/GroupImg.png'
import { Input, Form, Button, notification, ConfigProvider } from 'antd';

import { Loading3QuartersOutlined, MailOutlined } from '@ant-design/icons';

library.add(faEye, faEyeSlash);

function LoginPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ email: '', password: '' });
    const [isEmailEntered, setIsEmailEntered] = useState(false);
    const [emailColor, setEmailColor] = useState("#00000073");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [form] = Form.useForm()

    const [isEmpty, setIsEmpty] = useState(true);

    const openNotification = () => {
        notification.error({
            message: <div className='errorAlertHeader'>Geçersiz mail adresi!</div>,
            description: <div className='errorAlertDesc'>Girmiş olduğunuz mail adresinin sistemde <br></br> kaydı  bulunmamaktadır.</div>,
            style: {
                backgroundColor: '#FFF1F0',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)',
                borderRadius: '0.5rem',
            },
            onClick: () => {

            },
        });
    };

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

    const SendMail = async () => {
        setIsSending(true)
        await axios.post(`${process.env.REACT_APP_PORT}/user/forgotPassword`, { email: user.email, }) // canlı ip si http://64.225.103.36:5001/user/login

            .then(response => {

                if (!response.data.success) {
                    setIsSending(false)
                    openNotification()
                } else {
                    navigate('/done-forgot-password')
                }
            });

    }

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
                        <div className='title'>
                            <h1 style={{ marginBottom: '0px' }}>Şifre Yenile</h1>
                            <p style={{ marginBottom: '0px' }}>Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi yazın</p>
                        </div>
                        <div className='input-buttons'>
                            <div className='inputs'>
                                <Form
                                    form={form}
                                    autoComplete="off"
                                    style={{ width: '100%' }}
                                >
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Input: {
                                                    activeBorderColor: "#133163",
                                                    hoverBorderColor: "#133163",
                                                },
                                            },
                                        }}
                                    >
                                        <div className='header mb-2'>Mail</div>
                                        <Form.Item
                                            style={{ marginBottom: '0px' }}
                                            hasFeedback={isEmailEntered}
                                            validateTrigger="onBlur"
                                            name="email"
                                            rules={[
                                                {
                                                    type: 'email',
                                                    message: 'The input is not valid E-mail!',
                                                },
                                                {
                                                    required: true,
                                                    message: 'Please input your E-mail!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                name='email'
                                                type='email'
                                                size="large"
                                                placeholder="Mail adresinizi yazınız"
                                                prefix={<MailOutlined
                                                    style={{
                                                        fontSize: "16px",
                                                        color: `${emailColor}`
                                                    }}
                                                />}
                                                value={user.email}
                                                onChange={(e) => {
                                                    setIsValidEmail(e.target.value.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/g) ? true : false)
                                                    handleInputChange(e);
                                                }}
                                                onBlur={() => {
                                                    setIsEmailEntered(true);
                                                    const color = isValidEmail ? "#52C41A" : "#FF7875"
                                                    setEmailColor(color)
                                                }}
                                                disabled={isSending}
                                            />
                                        </Form.Item>
                                    </ConfigProvider>
                                </Form>
                            </div>
                            <div className='login-button'>
                                <Button disabled={!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/g.test(user.email)} size="large" type="primary" onClick={() => { SendMail() }} className='mt-4'>{!isSending ? (
                                    "İlerle"
                                ) : (
                                    <Loading3QuartersOutlined className="mt-1 animate-spin" />
                                )}</Button>
                                <div onClick={() => { navigate('/login') }} className='backToLogin' style={{ color: isSending ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.88)' }}>Giriş sayfasına geri dön</div>
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