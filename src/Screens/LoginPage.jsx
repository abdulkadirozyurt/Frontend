import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import loginPhoto from '../images/loginimg.png'
import logoo from '../images/Group.png'
import logoPhoto from '../images/GroupImg.png'
import { Input, Tooltip, Form, notification, Button, ConfigProvider } from 'antd';

import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import Login from './Login';

library.add(faEye, faEyeSlash);

function LoginPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ email: '', password: '' });

    const [isEmpty, setIsEmpty] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [form] = Form.useForm()
    const [isSending, setIsSending] = useState(false);
    const [isEmailEntered, setIsEmailEntered] = useState(false);
    const [isPasswordEntered, setIsPasswordEntered] = useState(false);
    const [passwordColor, setPasswordColor] = useState("#00000073");
    const [emailColor, setEmailColor] = useState("#00000073");
    const [rememberMe, setRememberMe] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
    };

    useEffect(() => {
        if (rememberMe && user.email) {
            localStorage.setItem('rememberedEmail', user.email);
        }
    }, [rememberMe, user.email]);

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            form.setFieldsValue({
                email: rememberedEmail
            })
            setUser(prevState => ({
                ...prevState,
                email: rememberedEmail
            }));
            setIsValidEmail(true);
            setEmailColor("#52C41A");
            localStorage.removeItem('rememberedEmail')
        }
    }, [form]);

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
                return true;
            }
        }
        return false;
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

    const openNotification = (state) => {
        if (state == 'success') {
            notification.success({
                message: <div className='successAlertHeader'>Giriş başarılı!</div>,
                style: {
                    backgroundColor: '#F6FFED',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)',
                    borderRadius: '0.5rem',
                },
                onClick: () => {

                },
            });
        }
        else if (state == 'error') {
            notification.error({
                message: <div className='errorAlertHeader'>Geçersiz giriş!</div>,
                description: 'Girmiş olduğunuz bilgiler sistemde kayıtlı değil.',
                style: {
                    backgroundColor: '#FFF1F0',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)',
                    borderRadius: '0.5rem',
                },
                onClick: () => {

                },
            });
        }
    };

    const HandleLogin = async () => {
        setIsSending(true);
        await axios.post(`${process.env.REACT_APP_PORT}/user/login`, { email: user.email, password: user.password }) // canlı ip si http://64.225.103.36:5001/user/login

            .then(response => {
                if (response.data.success) {

                    localStorage.setItem('userToken', response.data.accessToken)
                    localStorage.setItem('refreshToken', response.data.refreshToken)
                    openNotification('success')
                    setUser({ email: '', password: '' })

                    localStorage.getItem('userToken');
                    GetToken();
                } else {
                    setIsSending(false);

                    openNotification('error')
                }
            });

    }

    const handleBlur = () => {
        setIsEmailEntered(true);
        if (!isValidEmail) {
            setUser({ ...user, emailColor: "#FF7875" });
        } else {
            setUser({ ...user, emailColor: "#52C41A" });
        }
    };

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
                            <h1>İnsan Kaynaklarında <br />
                                Dijital Adımınız!</h1>
                            <p>Başlamak için lütfen giriş yapın</p>
                        </div>
                        <div className='input-buttons '>
                            <div className='inputs'>
                                <div className='inputs-form'>
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
                                                style={{ marginBottom: '1rem' }}
                                                hasFeedback={isEmailEntered}
                                                name="email"
                                                validateTrigger="onBlur"
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
                                            <div className='header mb-2'>Şifre</div>
                                            <Form.Item
                                                style={{ marginBottom: '0px' }}
                                                name="password"
                                                validateTrigger="onBlur"
                                                hasFeedback={isPasswordEntered}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your password!',
                                                    },

                                                ]}>
                                                <Input.Password
                                                    name='password'
                                                    type='password'
                                                    size="large"
                                                    placeholder="Şifrenizi yazınız"
                                                    prefix={<LockOutlined style={{
                                                        fontSize: "16px",
                                                        color: `${passwordColor}`
                                                    }} />}
                                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                    value={user.password}
                                                    onChange={(e) => { handleInputChange(e); setIsValidPassword(e.target.value.length >= 1 ? true : false) }}
                                                    onBlur={() => {
                                                        setIsPasswordEntered(true);
                                                        const color = isValidPassword ? "#52C41A" : "#FF7875"
                                                        setPasswordColor(color)
                                                    }}
                                                    disabled={isSending}
                                                />
                                            </Form.Item>
                                        </ConfigProvider>
                                    </Form>
                                </div>
                                <div className='wrapper'>
                                    <div className='wrapper-remember'>
                                        <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} />
                                        <div>Beni hatırla</div>
                                    </div>
                                    <Button type='link' onClick={() => { navigate('/forgot-password') }} style={{ fontFamily: 'SF Pro Display' }}>Şifremi unuttum</Button>
                                </div>
                            </div>
                            <div className='login-button'>
                                <Button size="large" onClick={() => HandleLogin()} disabled={!isValidEmail || !isValidPassword} >{!isSending ? (
                                    "Giriş Yap"
                                ) : (
                                    <Loading3QuartersOutlined className="mt-1 animate-spin" />
                                )}</Button>
                                <div>Kullanıcı bilgileriniz her zaman güvende!</div>
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