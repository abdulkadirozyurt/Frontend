import React, { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../Components/NavBar.jsx";
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
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

library.add(faEye, faEyeSlash);

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    company: "",
 
    phone: "",
  });
  const [isEmpty, setIsEmpty] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);


  const togglePasswordVisibilityPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const togglePasswordVisibilityConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const { countries } = useCountries();
  const [country, setCountry] = React.useState(50);
  const { flags, countryCallingCode } = countries[country];

  const [checkValidFullName, setCheckValidFullName] = useState(false);
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [checkValidCompanyName, setCheckValidCompanyName] = useState(false);
  const [checkValidPassword, setCheckValidPassword] = useState(false);
  const [checkValidPhone, setCheckValidPhone] = useState(false);

  const [fullPhoneNumber, setFullPhoneNumber] = useState("");

  const handleInputChange = (event) => {
    setUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCountryPhone = () => {
    const phoneNumber = countryCallingCode + user.phone;
    setFullPhoneNumber(phoneNumber.toString());
  };

  const Signup = async () => {
    
    const fullName_pattern=
      /^[a-zA-ZığüşöçĞÜŞÖÇİ\s]+$/;
    const email_pattern = 
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const password_pattern =
      /^(?=.*[a-zA-ZığüşöçĞÜŞÖÇİ])(?=.*[0-9])(?=.*[(),.":{}_#+~^|<>=@$!%*?&])[A-Za-z0-9ığüşöçĞÜŞÖÇİ(),.":{}_#+~^|<>=@$!%*?&]{8,}$/;
    const phone_pattern = /^[0-9]+$/;

    if (!fullName_pattern.test(user.name) || !user.name.trim()) {
      setCheckValidFullName(true);
      setCheckValidEmail(false);
      setCheckValidCompanyName(false);
      setCheckValidPhone(false);
      setCheckValidPassword(false); 
    } else if (!email_pattern.test(user.email)) {
      setCheckValidFullName(false);
      setCheckValidEmail(true);
      setCheckValidCompanyName(false);
      setCheckValidPhone(false);
      setCheckValidPassword(false); 
    } else if (!user.company.trim()) {
      setCheckValidFullName(false);
      setCheckValidEmail(false);
      setCheckValidCompanyName(true);
      setCheckValidPhone(false);
      setCheckValidPassword(false); 
    } else if (!phone_pattern.test(user.phone)) {
      setCheckValidFullName(false);
      setCheckValidEmail(false);
      setCheckValidCompanyName(false);
      setCheckValidPhone(true);
      setCheckValidPassword(false); 
    } else if (!password_pattern.test(user.password)) {
      setCheckValidFullName(false);
      setCheckValidEmail(false);
      setCheckValidCompanyName(false);
      setCheckValidPhone(false);
      setCheckValidPassword(true); 
    } else {
      setCheckValidFullName(false);
      setCheckValidEmail(false);
      setCheckValidCompanyName(false);
      setCheckValidPhone(false);
      setCheckValidPassword(false);

      await axios
        .post(`${process.env.REACT_APP_PORT}/user/register`, {
          companyName: user.company,
          email: user.email,
          password: user.password,
          passwordConfirmation: user.passwordConfirm,
          phone: user.phone,
          phoneCode:countryCallingCode,
          fullName: user.name,
        })
        .then((response) => {
          
          if (response.data.success) {
            alert(response.data.message);
            
            navigate("/login");
            const nullCandidateState = {};
            for (const key in user) {
              nullCandidateState[key] = null;
            }
            setUser(nullCandidateState);
          } else {
            window.alert(response.data.message);
          }
        });
    }
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

  useEffect(() => {
    setIsEmpty(checkEmptyFields());
  }, [user]);

  return (
    <div>
      {" "}
      <NavBar />
      <div className="flex justify-center items-center mt-10">
        <Card className="w-96">
          <CardHeader
            variant="gradient"
            color="gray"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Register
            </Typography>
          </CardHeader>
          <CardBody className="ml-50 flex flex-col gap-4">
            <Input
              label="Full Name"
              size="lg"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
            {checkValidFullName ? (
            <div>
              {!user.name.trim() ? (
                <div>* Full name cannot be empty</div>
              ) : !/^[a-zA-ZığüşöçĞÜŞÖÇİ\s]+$/.test(user.name) ? (
                <div>* Fullname should only contain letters</div>
              ) : (
                <div></div>
              )}
            </div>
            ) : (
              <div></div>
            )}
            <Input
              type="email"
              label="Email"
              size="lg"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
            {checkValidEmail ? (
            <div>
              {/[ığüşöçĞÜŞÖÇİ]/.test(user.email) ? (
                <div>* Do not use Turkish letters</div>
              ) : !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(user.email) ? (
                <div>* Invalid email format</div>
              ) : (
                <div></div>
              )}
            </div>
            ) : (
              <div></div>
            )}
            <Input
              label="Company name"
              size="lg"
              name="company"
              value={user.company}
              onChange={handleInputChange}
            />
            {checkValidCompanyName ? (
            <div>
              {!user.company.trim() ? (
                <div>* Company name cannot be empty</div>
              ) : (
                <div></div>
              )}
            </div>
            ) : (
              <div></div>
            )}
            <div className="relative flex w-full max-w-[24rem]">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    <img
                      src={flags.svg}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    {countryCallingCode}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {countries.map(
                    ({ name, flags, countryCallingCode }, index) => {
                      return (
                        <MenuItem
                          key={name}
                          value={name}
                          className="flex items-center gap-2"
                          onClick={() => setCountry(index)}
                        >
                          <img
                            src={flags.svg}
                            alt={name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          {name}{" "}
                          <span className="ml-auto">{countryCallingCode}</span>
                        </MenuItem>
                      );
                    }
                  )}
                </MenuList>
              </Menu>
              <Input
                type="tel"
                placeholder="Mobile Number"
                name="phone"
                value={user.phone}
                onBlur={handleCountryPhone}
                onChange={handleInputChange}
                className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
              />
            </div>
            <div>
              {checkValidPhone ? (
                <div>* Phone number should only contain digits</div>
              ) : (
                <div></div>
              )}
            </div>
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
            {checkValidPassword ? (
            <div>
              {user.password.length < 8 ? (
                <div>* Should be at least eight characters long </div>
              ) : (
                <div>
                  {/[A-ZĞÜŞÖÇİ]/.test(user.password) ? null : <div>* Must contain at least one letter</div>}
                  {/\d/.test(user.password) ? null : <div>* Must contain at least one digit</div>}
                  {/[(),.":{}_#+~^|<>=@$!%*?&]/.test(user.password) ? null : <div>* Must contain at least one symbol</div>}
                </div>
              )}
            </div>
            ) : (
              <div></div>
            )}

            <div className="relative flex items-center">
              <Input
                type={showPasswordConfirm ? "text" : "password"}
                label="Password Confirm"
                size="lg"
                name="passwordConfirm"
                value={user.passwordConfirm}
                onChange={handleInputChange}
                className="relative z-10"
              />
              <Button
                size="sm"
                onClick={togglePasswordVisibilityConfirm}
                className="ml-2"
              >
                {showPasswordConfirm ? (
                  <FontAwesomeIcon icon="eye-slash" />
                ) : (
                  <FontAwesomeIcon icon="eye" />
                )}
              </Button>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              disabled={isEmpty}
              onClick={() => Signup()}
            >
              Register
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Have you an account?
              <Typography
                as="a"
                href="/login"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
              >
                Login
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Register;
