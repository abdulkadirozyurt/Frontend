import "bootstrap/dist/css/bootstrap.min.css";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {TrashIcon} from "@heroicons/react/24/solid";
import {
  FormGroup,
  Label,
  Col,
  Input,
  FormText,
  Button,
  Form,
} from "reactstrap";
import { useCountries } from "use-react-countries";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MenuHandler,
  MenuList,
  MenuItem,
  Menu,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

export default function AddCandidate() {
  const navigate = useNavigate();

  let id;
  //let phoneCode;
  const location = useLocation();
  location.state ? id = location.state.item._id : id = null
  //location.state ?  phoneCode=location.state.item.phoneCode : phoneCode=null
  const [candidate, setCandidate] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    phoneCode: "",
    socials: "",
    location: "",
    workType: [],
    workModel: "",
    technicalSkills: [],
    salaryExpectation: "",
    languageSkills: [],
    militaryServiceStatus: "",
    //status: "",
    createDate: "",
    job: "",
    gender: "",
    cvName: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const { countries } = useCountries();
  const [country, setCountry] = React.useState(50);
  const { flags, countryCallingCode } = countries[country];

  const [checkValidEmail, setCheckValidEmail] = useState(false);

  const [checkValidPhone, setCheckValidPhone] = useState(false);

  const [checkValidSalary, setCheckValidSalary] = useState(false);

  
  const handleInputChange = (event) => {
    setCandidate((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const handlePhoneChange = (event) => {
    setCandidate((prevState) => ({
      ...prevState,
      ['phone']: event.target.value,
    }));
  };

  const handleCountryChange = (event) => {
    
    
    setCandidate((prevState) => ({
      ...prevState,
      ['phoneCode']: event,
    }));
  };

  const handleWorkTypeChange = (selectedOption) => {
    const selectedValue = selectedOption.value;

    setCandidate((prevState) => ({
      ...prevState,
      ['workType']: selectedValue,
    }));
  };



  const handleWorkModelChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setCandidate((prevState) => ({
      ...prevState,
      ['workModel']: selectedValue,
    }));
  };

  const handleMilitaryChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setCandidate((prevState) => ({
      ...prevState,
      ['militaryServiceStatus']: selectedValue,
    }));
  };

  // const handleStatus = (selectedOption) => {
  //   const selectedValue = selectedOption.value;
  //   setCandidate((prevState) => ({
  //     ...prevState,
  //     ['status']: selectedValue,
  //   }));
  // };

  const addLanguageSkill = async () => {
    
    setCandidate((prevState) => {
      const updatedLanguageSkills = [...prevState.languageSkills, newSkill];
      
      return {
        ...prevState,
        languageSkills: updatedLanguageSkills,
      };
    });
    setNewSkill('');
    
  };

  const addTechnicalSkill = async () => {
    
    setCandidate((prevState) => {
      const updatedTechnicalSkills = [...prevState.technicalSkills, newTechnicalSkill];
      
      return {
        ...prevState,
        technicalSkills: updatedTechnicalSkills,
      };
    });
    setNewTechnicalSkill('')
    
  };

  const Save = async () => {

    const confirmDelete = window.confirm("Bu işlem adayın cv'si bulunuyorsa cv'yi değiştirecek yoksa ekleyecektir. Onaylıyor musunuz?");
    if (!confirmDelete) {
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    await axios.post(`${process.env.REACT_APP_PORT}/file/file`, formData)
      .then(response => {
        
        if (response.data.success) {
          
          setCandidate(prevState => ({
            ...prevState,
            cvName: response.data.fileName
          }));
          alert(response.data.message);
        } else {
          alert(response.data.message);
        }
      });
  };

  const handleGender = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setCandidate((prevState) => ({
      ...prevState,
      ['gender']: selectedValue,
    }));
  };

  const getCandidateById = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_PORT}/candidate/candidate/id`, { _id: id })
        .then((response) => {
          
          if (response.data.success) {
            const data = Object.values(response.data.candidate);
            setCandidate(response.data.candidate);
            // path=`http://localhost:5000/uploads/${candidate.cvName}`;
            // setSrcValue(`http://localhost:5000/uploads/${candidate.cvName}`);


          } else {
            window.alert(response.data.message);
          }
        });

    } catch (error) {
      console.error('Verileri alma hatası:', error);
    }
  };


 

  const delteCv = async () => {
    const confirmDelete = window.confirm("Bu işlem adayın cvsini geçici olarak silecektir. Değişiklikleri kaydetmek için kaydet butonunu kullanınız ");
    if (!confirmDelete) {
      return;
    }
    setCandidate((prevState) => ({...prevState,['cvName']: null}))
  };

  const Update = async () => {

    const email_pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const phone_pattern = /^[0-9]+$/;
    // const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!email_pattern.test(candidate.email)) {
      setCheckValidEmail(true);
    } else if (!phone_pattern.test(candidate.phone)) {
      setCheckValidPhone(true);
    } else if (candidate.salaryExpectation && !phone_pattern.test(candidate.salaryExpectation)) {
      setCheckValidSalary(true);
    }
    else {
      setCheckValidEmail(false);
      setCheckValidPhone(false);
      setCheckValidSalary(false);

      const confirmDelete = window.confirm("Bu işlem adayın bilgilerini değiştirecektir. Onaylıyor musunuz?");
      if (!confirmDelete) {
        return;
      }

      await axios
        .put(`${process.env.REACT_APP_PORT}/candidate/candidate`, candidate)
        .then((response) => {
          
          if (response.data.success) {
            alert(response.data.message);
            navigate("/user/list-candidates");
          } else {
            window.alert(response.data.message);
          }
        });
    }
  };


  const Submit = async () => {


    const email_pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const phone_pattern = /^[0-9]+$/;

    if (!email_pattern.test(candidate.email)) {
      setCheckValidEmail(true);
    } else if (!phone_pattern.test(candidate.phone)) {
      setCheckValidPhone(true);
      setCheckValidEmail(false);
    } else if (candidate.salaryExpectation && !phone_pattern.test(candidate.salaryExpectation)) {
      setCheckValidSalary(true);
      setCheckValidEmail(false);
      setCheckValidPhone(false);
    }
    else {
      setCheckValidEmail(false);
      setCheckValidPhone(false);
      setCheckValidSalary(false);
      const confirmDelete = window.confirm("Bu adayı eklemek istediğinize emin misiniz?");
      if (!confirmDelete) {
        return;
      }

      await axios
        .post(`${process.env.REACT_APP_PORT}/candidate/candidate`, candidate)
        .then((response) => {
          
          if (response.data.success) {
            alert(response.data.message);

            navigate("/user/list-candidates");
            const nullCandidateState = {};
            for (const key in candidate) {
              nullCandidateState[key] = null;
            }
            setCandidate(nullCandidateState);
          } else {

            window.alert(response.data.message);
          }
        });
    }
  };

  useEffect(() => {

    if (id) {
      getCandidateById();

      setCandidate((prevState) => ({
        ...prevState,
        ['phoneCode']: location.state.item.phoneCode,
      }));
    }
    
  }, []);

  return (
      <div className="container my-5 px-5">
        <FormGroup row>
          <Label for="fullName" sm={2}>
            FullName
          </Label>
          <Col sm={10}>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={candidate.fullName}
              onChange={handleInputChange}
            />
            {candidate.fullName ? (<div></div>) : (
              <div><Col sm={10}>Name is required </Col></div>
            )}
          </Col>

        </FormGroup>
        <FormGroup row>
          <Label for="email" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              id="email"
              name="email"
              type="email"
              value={candidate.email}
              onChange={handleInputChange}
            />
            {candidate.email ? (<div></div>) : (
              <div><Col sm={10}>Email is required </Col></div>
            )}
            {checkValidEmail ? <div>wrong email format</div> : <div></div>}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="phone" sm={2}>
            Phone
          </Label>

          <Col sm={10}>
            <div className="relative flex w-full">
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 w-12 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                  >
                    {id ? (
                      countries.map(
                        ({ flags, countryCallingCode }) => {
                          if (countryCallingCode == candidate.phoneCode) {
                            return (
                              <img
                                src={flags.svg}
                                className="h-4 w-4 rounded-full object-cover"
                              />
                            );
                          }

                        }
                      )
                    ) : (
                      <img
                        src={flags.svg}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                    )}

                    {id ? (
                      candidate.phoneCode
                    ) : (
                      countryCallingCode
                    )}

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
                          <span className="ml-auto" value={candidate.phoneCode}>{countryCallingCode}</span>
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
                value={candidate.phone}
                // onBlur={handleCountryPhone}
                onChange={handlePhoneChange}
                className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
              />

            </div>
            {candidate.phone ? (<div></div>) : (
              <div><Col sm={10}>Phone is required </Col></div>)}
            {checkValidPhone ? (
              <div> Phone number should consist of digits only.</div>
            ) : (
              <div></div>
            )}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="job" sm={2}>
            Function
          </Label>
          <Col sm={10}>
            <Input
              id="job"
              name="job"
              type="text"
              value={candidate.job}
              onChange={handleInputChange}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="workModel" sm={2}>
            Gender
          </Label>
          <Col sm={10}>
            <Dropdown
              id="gender"
              name="gender"
              onChange={handleGender}
              value={candidate.gender}
              options={[
                { label: "Woman", value: "woman" },
                { label: "Man", value: "man" },
              ]}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="socials" sm={2}>
            Socials
          </Label>
          <Col sm={10}>
            <Input
              id="linkedin"
              name="socials"
              type="url"
              className="mt-2"

              onChange={handleInputChange}
              value={candidate.socials}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="location" sm={2}>
            Location
          </Label>
          <Col sm={10}>
            <Input
              id="location"
              name="location"
              type="text"
              className="mt-2"
              placeholder="City, District"
              onChange={handleInputChange}
              value={candidate.location}

            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="workType" sm={2}>
            Worktype
          </Label>
          <Col sm={10}>
            <Dropdown
              id="workType"
              name="workType"
              onChange={handleWorkTypeChange}
              value={candidate.workType[0]}
              options={[
                { label: "Hybrid", value: "hybrid" },
                { label: "Remote", value: "remote" },
                { label: "Office", value: "office" },
              ]}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="workModel" sm={2}>
            Workmodel
          </Label>
          <Col sm={10}>
            <Dropdown
              id="workModel"
              name="workModel"
              onChange={handleWorkModelChange}
              value={candidate.workModel}
              options={[
                { label: "Insource", value: "insource" },
                { label: "Outsource", value: "outsource" },
                { label: "Freelance", value: "freelance" },
              ]}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={2}>
            Technical Skill
          </Col>
          <Col sm={4}>
            <input type="text" placeholder="Technical Skill" value={newTechnicalSkill} onChange={(e) => setNewTechnicalSkill(e.target.value)} />
            <button onClick={addTechnicalSkill}>Ekle</button>
          </Col>
          <Col sm={6}>
            <ul>
              {candidate.technicalSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col sm={2}>
            Language Skill
          </Col>
          <Col sm={4}>
            <input type="text" placeholder="Language Skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            <button onClick={addLanguageSkill}>Ekle</button>
          </Col>
          <Col sm={6}>
            <ul>
              {candidate.languageSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="salaryexpectation" sm={2}>
            Salary Expectation
          </Label>
          <Col sm={10}>
            <Input
              id="salaryExpectation"
              name="salaryExpectation"
              type="text"
              className="mt-2"
              value={candidate.salaryExpectation}
              onChange={handleInputChange}
            />
            {checkValidSalary ? <div>Salary Expectation should consist of digits only.</div> : <div></div>}

          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="military" sm={2}>
            Military Service Status
          </Label>
          <Col sm={10}>
            <Dropdown
              id="militaryServiceStatus"
              name="militaryServiceStatus"
              value={candidate.militaryServiceStatus}
              options={[
                { label: "Done", value: "done" },
                { label: "Postponed", value: "postponed" },
                { label: "Exempted", value: "exempted" },
              ]}
              onChange={handleMilitaryChange}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          {id ? (<div>
            <Label sm={2}>
              Created Date
            </Label>
            <Col sm={10}>
              <Label>{candidate.createDate} </Label>
            </Col>

          </div>
          ) : (
            <div></div>
          )}

        </FormGroup>

        <FormGroup row>

          {/* {id ? (<div>
            <Label sm={2}>
              Status
            </Label>
            <Col sm={10}>
              <Dropdown
                id="status"
                name="status"
                value={candidate.status}
                options={[
                  { label: "Create", value: "create" },
                  { label: "Contact", value: "contact" },

                ]}
                onChange={handleStatus}
              />
            </Col>
          </div>
          ) : (
            <div></div>
          )} */}
        </FormGroup>
        <FormGroup row>
          {id ? (
            <Label for="resume" sm={2}>
              Cv Update
            </Label>
          ) : (
            <Label for="resume" sm={2}>
              Cv Dowload
            </Label>
          )}

          <Col sm={9}>
            <Input
              id="resume"
              name="resume"
              type="file"
              placeholder="a"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <FormText></FormText>
          </Col>
          <Col sm={1}>
            <Button onClick={() => Save()} disabled={!selectedFile}>Upload</Button>
          </Col>
        </FormGroup>

        <FormGroup check row>
          <Col
            sm={{
              offset: 4,
              size: 10,
            }}
            width='100%'>
            {id ? (
              <Button onClick={() => Update()} disabled={!candidate.fullName || !candidate.email || !candidate.phone}>Save Changes</Button>
            ) : (
              <Button onClick={() => Submit()} disabled={!candidate.fullName || !candidate.email || !candidate.phone}>Submit</Button>

            )}

          </Col>
        </FormGroup>
        {id && candidate.cvName ? (
          <FormGroup row>
            <Label for="resume" >
              Cv File
              <Tooltip content="Delete Cv">
                <IconButton variant="text" onClick={() =>delteCv()}>
                <TrashIcon className="h-4 w-4" />
                </IconButton>    
              </Tooltip>
            </Label>
            <Col>

              <iframe src={`${process.env.REACT_APP_PORT}/uploads/${candidate.cvName}`} width="100%" height="500%" />
            </Col>
          </FormGroup>
        ) : (
          <div></div>
        )}
      </div>
  );
}
