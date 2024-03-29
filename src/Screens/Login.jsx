import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import NavBar from '../Components/NavBar.jsx';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";

library.add(faEye, faEyeSlash);

function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ email: '', password: '' });

    const [isEmpty, setIsEmpty]= useState(true);
    const [showPassword, setShowPassword] = useState(false);
   
    const togglePasswordVisibilityPassword = () => {
      setShowPassword(!showPassword);
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
            navigate('/dashboard')
            
          })
          .catch(error => {
            console.error("error", error);
            alert("Kimlik doğrulama sırasında bir hata oluştu.");
          });
    };

    const HandleLogin = async () => {      
        
        await axios.post(`${process.env.REACT_APP_PORT}/user/login`, { email:user.email, password:user.password }) // canlı ip si http://64.225.103.36:5001/user/login

            .then(response => {
                
                if (response.data.success) {
                    localStorage.setItem('userToken', response.data.accessToken)
                    localStorage.setItem('refreshToken', response.data.refreshToken)
                    alert(response.data.message)

                    setUser({email:'',password:''})                                      

                    // localStorage.getItem('userToken');
                    GetToken();
                } else {
                    alert(response.data.message);
                }
            });
            
    }

    useEffect(() => {
        setIsEmpty(checkEmptyFields());
    }, [user]);

    return (
        <div>
            <NavBar />
            <div className='flex justify-center items-center mt-10'>
                <Card className="w-96">
                    <CardHeader
                        variant="gradient"
                        color="gray"
                        className="mb-4 grid h-28 place-items-center"
                    >
                        <Typography variant="h3" color="white">
                            LOGIN
                        </Typography>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-4">
                        <Input type="email" label="Email" size="lg" name="email" value={user.email} onChange={handleInputChange} />
                        <div className="relative flex items-center">
                        <Input
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            size="lg"
                            name="password"
                            value={user.password}
                            onChange={handleInputChange}
                            className="relative z-10"
                        />
                        <Button
                            size="sm"
                            onClick={togglePasswordVisibilityPassword}
                            className="ml-2"
                        >
                            {showPassword ? (
                            <FontAwesomeIcon icon="eye-slash" />
                            ) : (
                            <FontAwesomeIcon icon="eye" />
                            )}
                        </Button>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">

                        <Button variant="gradient" fullWidth disabled={isEmpty} onClick={() => HandleLogin()}>
                            LOGIN
                        </Button>

                        <Typography variant="small" className="mt-6 flex justify-center">
                            Dont have an account?
                            <Typography
                                as="a"
                                href="/register"
                                variant="small"
                                color="blue-gray"
                                className="ml-1 font-bold"
                            >
                                Sign up
                            </Typography>
                        </Typography>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );

}

export default Login;