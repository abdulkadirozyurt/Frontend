import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import loginPhoto from '../images/loginimg.png'
import logoo from '../images/Group.png'
import logoPhoto from '../images/GroupImg.png'
import { Input, Form, Alert, Button, notification, ConfigProvider } from 'antd';
import axios from 'axios'


library.add(faEye, faEyeSlash);

function LoginPage() {
    const navigate = useNavigate();

    const { id, token } = useParams();
    const [password, setPassword] = useState({ password: '', passwordConfirm: '' });
    const [isPasswordEntered, setIsPasswordEntered] = useState(false);
    const [alertClass, setAlertClass] = useState();
    const [isEmpty, setIsEmpty] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [form] = Form.useForm()

    const [alert1, setAlert1] = useState('ml-1');
    const [alert2, setAlert2] = useState('ml-1');
    const [alert3, setAlert3] = useState('ml-1');
    const [alert4, setAlert4] = useState('ml-1');
    const [alert5, setAlert5] = useState('hidden ml-1');
    const [type, setType] = useState('warning');
    const [disabled, setDisabled] = useState(true);

    const handleInputChange = (event) => {
        setPassword((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));


        if (event.target.name == 'password') {
            event.target.value.length > 8 ? setAlert1('hidden') : setAlert1('visible ml-1');
            /(?=.*[A-Z])/.test(event.target.value) ? setAlert2('hidden') : setAlert2('visible ml-1');
            /\d/.test(event.target.value) ? setAlert3('hidden') : setAlert3('visible ml-1');
            /[(),.":{}_#+~^|<>=@$!%*?&]/.test(event.target.value) ? setAlert4('hidden') : setAlert4('visible ml-1');

            if (event.target.value.length > 8 &&
                /(?=.*[A-Z])/.test(event.target.value) &&
                /\d/.test(event.target.value) &&
                /[(),.":{}_#+~^|<>=@$!%*?&]/.test(event.target.value)) {
                setType('success');
                setAlert5('visible');

            } else {
                setType('warning');
                setAlert5('hidden');
                setDisabled(true);
            }
        }
    };

    const checkEmptyFields = () => {
        const userKeys = Object.keys(password);
        for (let key of userKeys) {
            if (!password[key]) {
                return true;
            }
        }
        return false;
    };

    const openNotification = () => {
        notification.success({
            message: <div className='successAlertHeader'>Şifreniz başarıyla oluşturuldu!</div>,
            description: 'Kullanıcı bilgileriniz ile giriş yapabilirsiniz',
            style: {
                backgroundColor: '#F6FFED',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.02), 0px 1px 6px -1px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.03)',
                borderRadius: '0.5rem',
            },
            onClick: () => {

            },
        });
    };

    const handleButtonClick = async () => {
        setIsSending(true);

        await axios.post(`${process.env.REACT_APP_PORT}/user/resetPassword`, { id: id, password: password.password, token: token }) // canlı ip si http://64.225.103.36:5001/user/login

            .then(response => {

            });


        navigate('/login')
        openNotification()
    };

    const handleInputBlur = (event) => {
        if (event.target.name == 'password') {
            event.target.value.length > 8 ? setAlert1('hidden') : setAlert1('visible ml-1');
            /(?=.*[A-Z])/.test(event.target.value) ? setAlert2('hidden') : setAlert2('visible ml-1');
            /\d/.test(event.target.value) ? setAlert3('hidden') : setAlert3('visible ml-1');
            /[(),.":{}_#+~^|<>=@$!%*?&]/.test(event.target.value) ? setAlert4('hidden') : setAlert4('visible ml-1');

            if (event.target.value.length > 8 &&
                /(?=.*[A-Z])/.test(event.target.value) &&
                /\d/.test(event.target.value) &&
                /[(),.":{}_#+~^|<>=@$!%*?&]/.test(event.target.value)) {
                setType('success');
                setAlert5('visible ml-1');
            } else {
                setType('warning');
                setAlert5('hidden ml-1');
                setDisabled(true);
            }
        }
    };

    useEffect(() => {
        setIsEmpty(checkEmptyFields());
        const isPasswordsMatch = password.passwordConfirm === password.password;
        const isPasswordValid =
            password.passwordConfirm.length > 8 &&
            /(?=.*[A-Z])/.test(password.passwordConfirm) &&
            /\d/.test(password.passwordConfirm) &&
            /[(),.":{}_#+~^|<>=@$!%*?&]/.test(password.passwordConfirm) &&
            password.password.length > 8 &&
            /(?=.*[A-Z])/.test(password.password) &&
            /\d/.test(password.password) &&
            /[(),.":{}_#+~^|<>=@$!%*?&]/.test(password.password);

        if (isPasswordsMatch && isPasswordValid) {
            setDisabled(false);
            setAlertClass('hidden');
        }
        else {
            setAlertClass('visible');

            setDisabled(true);
        }
    }, [password]);


    return (
        <div className='loginPageDiv'>
            <div className='loginPageLeft'>
                <img src={loginPhoto} className="bg-contain max-w-[666px] lg:block h-full lg:bg-left" />
            </div>
            <div className='loginPageRight'>
                <div className='form'>
                    <div className='title'>
                        <h1>Şifre Belirle</h1>
                        <p style={{ marginBottom: '0px' }}>Lütfen şifre kurallarına uygun olarak şifrenizi belirleyin</p>
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
                                    <div className='header mb-2'>Şifre</div>
                                    <Form.Item
                                        hasFeedback={isPasswordEntered}
                                        style={{ marginBottom: '1rem' }}
                                        name="password"
                                        validateTrigger="onBlur"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                            {
                                                min: 8,
                                                message: '',
                                            },
                                            {
                                                pattern: /(?=.*[A-Z])/,
                                                message: '',
                                            },
                                            {
                                                pattern: /\d/,
                                                message: '',
                                            },
                                            {
                                                pattern: /[(),.":{}_#+~^|<>=@$!%*?&]/,
                                                message: '',
                                            }
                                        ]
                                        }
                                    >
                                        <Input
                                            name='password'
                                            type='passwordConfirm'
                                            size="large"
                                            placeholder="Şifrenizi yazınız"
                                            className='passwordInput'
                                            // iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            value={password.password}
                                            onChange={handleInputChange}
                                            onBlur={() => {
                                                setIsPasswordEntered(true);
                                            }}
                                            disabled={isSending}

                                        />
                                    </Form.Item>
                                    <div className='header mb-2'>Şifre Tekrar</div>
                                    <Form.Item
                                        style={{ marginBottom: '0px' }}
                                        name="passwordConfirm"
                                        validateTrigger="onBlur"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            }
                                        ]}>
                                        <Input
                                            name='passwordConfirm'
                                            type='passwordConfirm'
                                            size="large"
                                            placeholder="Şifrenizi tekrar yazınız"
                                            className='passwordInput'
                                            // iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            value={password.passwordConfirm}
                                            onChange={handleInputChange}
                                            disabled={isSending}

                                        />
                                    </Form.Item>
                                </ConfigProvider>
                            </Form>

                        </div>
                        <div className='w-full' >
                            <Alert className={alertClass}
                                message={<div className='passwordRulesHeader ml-1'>Şifre Kuralları</div>}
                                description={<div>
                                    <div className={alert1}>En az 8 karakter içermelidir</div>
                                    <div className={alert2}>En az 1 büyük harf içermelidir</div>
                                    <div className={alert3}>En az 1 rakam içermelidir</div>
                                    <div className={alert4}>En az 1 sembol içermelidir</div>
                                    <div className={alert5}>Lütfen belirlediğiniz şifreyi tekrar yazın</div>
                                </div>}
                                type={type}
                                showIcon
                            />
                        </div>
                        <div className='login-button'>

                            <Button size="large" type="primary" onClick={handleButtonClick} disabled={disabled} className=''> Şifre Belirle</Button>
                            <div onClick={() => { navigate('/login') }}>Giriş sayfasına geri dön</div>
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
    );
}

export default LoginPage;