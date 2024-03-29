import axios from "axios";
import React, { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import { useNavigate } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Input } from "reactstrap";

library.add(faEye, faEyeSlash);

function EditProfile() {
  const navigate = useNavigate();
  const { countries } = useCountries();
  const [isEmpty, setIsEmpty] = useState(true);
  const [country, setCountry] = React.useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { flags, countryCallingCode } = countries[country];
  const [checkValidPhone, setCheckValidPhone] = useState(false);
  const [checkValidFullName, setCheckValidFullName] = useState(false);
  const [checkValidPassword, setCheckValidPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [user, setUser] = useState({
    name: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    phoneCode: "",
  });

  const togglePasswordVisibilityPassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilityConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleInputChange = (event) => {
    setUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  // const handleCountryPhone = () => {
  //   const phoneNumber = countryCallingCode + user.phone;
  //   setFullPhoneNumber(phoneNumber.toString());
  // };

  // const handleCountryPhone = () => {
  //   const phoneNumber = user.phone;
  //   setFullPhoneNumber(phoneNumber.toString());
  // };

  const Submit = async () => {
    // const email_pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const password_pattern =
      /^(?=.*[a-zA-ZığüşöçĞÜŞÖÇİ])(?=.*[0-9])(?=.*[(),.":{}_#+~^|<>=@$!%*?&])[A-Za-z0-9ığüşöçĞÜŞÖÇİ(),.":{}_#+~^|<>=@$!%*?&]{8,}$/;
    const phone_pattern = /^[0-9]+$/;

    // if (!email_pattern.test(user.email)) {
    //   setCheckValidFullName(false);
    //   setCheckValidPhone(false);
    //
    // } else

    if (!phone_pattern.test(user.phone)) {
      setCheckValidFullName(false);
      setCheckValidPhone(true);

    } else if (user.password || user.passwordConfirm) {
      // Parola alanlarından herhangi birine bir şey girilmişse parola doğrulaması yap
      if (user.password !== user.passwordConfirm) {
        window.alert("Password and password confirmation do not match");
        return;
      } else {
        const password_pattern =
          /^(?=.*[a-zA-ZığüşöçĞÜŞÖÇİ])(?=.*[0-9])(?=.*[(),.":{}_#+~^|<>=@$!%*?&])[A-Za-z0-9ığüşöçĞÜŞÖÇİ(),.":{}_#+~^|<>=@$!%*?&]{8,}$/;

        if (!password_pattern.test(user.password)) {
          window.alert("Password does not meet the criteria");
          return;
        }
      }
    } else {
      setCheckValidFullName(false);
      setCheckValidPhone(false);
      setCheckValidPassword(false);


      const accessToken = localStorage.getItem("userToken");


      await axios
        .put(`${process.env.REACT_APP_PORT}/user/updateUser`, user, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {

          if (response.data.success) {
            alert(response.data.message);

            navigate("/user/dashboard");
            setUser({
              password: "",
              passwordConfirm: "",
              phone: "",
              phoneCode: "",
            });
          } else {
            window.alert(response.data.message);
          }
        })
        .catch((error) => {

        });
    }
  };

  const checkEmptyFields = () => {
    const userKeys = Object.keys(user);
    for (let key of userKeys) {
      if (!user[key] && !key === "fullName") {
        return true; // Eğer bir özellik boşsa, true döndür
      }
    }
    return false; // Eğer tüm özellikler doluysa, false döndür
  };

  useEffect(() => {
    setIsEmpty(checkEmptyFields());
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const fetchUser = async () => {
      try {
        // 
        //
        await axios
          .post(
            `${process.env.REACT_APP_PORT}/user/getUser/id`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then((response) => {
            if (response.data.success) {
              let userData = response.data.user;
              userData.password = "";
              setUser(userData);
              setCheckValidPhone(false);
              setCheckValidPassword(false);

            } else {

            }
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const handlePhoneChange = (event) => {
    setUser((prevState) => ({
      ...prevState,
      ["phone"]: event.target.value,
    }));
  };
  const handleCountryChange = (event) => {


    setUser((prevState) => ({
      ...prevState,
      ["phoneCode"]: event,
    }));
  };

  useEffect(() => {

  }, [user.phoneCode]);

  useEffect(() => {
    // Sayfa yüklendiğinde phoneCode değerine göre ülkenin index'ini bul ve set et
    const defaultCountryIndex = countries.findIndex(
      (country) => country.countryCallingCode === user.phoneCode,
    );

    if (defaultCountryIndex !== -1) {
      setCountry(defaultCountryIndex);
    }
  }, [user.phoneCode, countries]);

  //*************************************************************************** */

  //*************************************************************************** */

  return (
    <div className="flex justify-center items-center mt-5 w-1/2 ">
      <div className="flex-1 justify-center items-center mt-10">
        <Card className="w-full">
          <CardHeader
            variant="gradient"
            color="gray"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Your Profile
            </Typography>
          </CardHeader>
          <CardBody className="ml-50 flex flex-col gap-4">
            <Input
              label="Full Name"
              size="lg"
              name="name"
              value={user.fullName}
              // onChange={handleInputChange}
              disabled={true}
            />
            {/* {checkValidFullName ? (
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
            )} */}

            {/* <Input
              type="email"
              label="Email"
              size="lg"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            /> */}

            {/* {checkValidEmail ? (
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
            )} */}

            <div className="relative flex w-full max-w-[24rem]">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={flags.svg}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    {countryCallingCode}
                  </Button>
                </MenuHandler>

                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {countries
                    .sort((a, b) => a.name.localeCompare(b.name))
                    // .filter(
                    //   ({ name, flags, countryCallingCode }) =>
                    //     name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    //     countryCallingCode.includes(searchTerm)
                    // )
                    .map(({ name, flags, countryCallingCode }, index) => {
                      return (
                        <MenuItem
                          key={name}
                          value={name}
                          className="flex items-center gap-2"
                          onClick={() => {
                            setCountry(index);
                            handleCountryChange(countryCallingCode);
                          }}
                        >
                          <img
                            src={flags.svg}
                            alt={name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          {name}{" "}
                          <span className="ml-auto" value={user.phoneCode}>
                            {countryCallingCode}
                          </span>
                        </MenuItem>
                      );
                    })}
                </MenuList>
              </Menu>
              {/* <Input
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
              /> */}

              <Input
                type="tel"
                placeholder="Mobile Number"
                name="phone"
                value={user.phone}
                // onBlur={handleCountryPhone}
                onChange={(e) =>
                  handlePhoneChange({
                    target: {
                      name: "phone",
                      value: e.target.value.replace(/\D/g, ""),
                    },
                  })
                }
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
                placeholder={"password"}
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
                    {/[A-ZĞÜŞÖÇİ]/.test(user.password) ? null : (
                      <div>* Must contain at least one letter</div>
                    )}
                    {/\d/.test(user.password) ? null : (
                      <div>* Must contain at least one digit</div>
                    )}
                    {/[(),.":{}_#+~^|<>=@$!%*?&]/.test(user.password) ? null : (
                      <div>* Must contain at least one symbol</div>
                    )}
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
                placeholder={"confirm password"}
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
              onClick={() => Submit()}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default EditProfile;
