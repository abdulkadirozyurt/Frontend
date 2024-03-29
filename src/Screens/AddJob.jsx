import axios from "axios";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

export default function AddJob() {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    quota: "",
    company: "",
    location: "",
    workType: "",
    positionName: "",
    employmentType: "",
    jobDescription: "",
    qualifications: "",
    postedAt: Date.now(),
    applicationDeadline: "",
  });

  const [isEmpty, setIsEmpty] = useState(true);
  const [checkFormDate, setCheckFormDate] = useState(false);

  const [isValidApplicationDeadline, setIsValidApplicationDeadline] =
    useState();

  const Submit = async () => {
    if (!isEmpty && isValidApplicationDeadline) {
      await axios
        .post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`, {
          company: job.company,
          postedAt: Date.now(),
          location: job.location,
          workType: job.workType,
          quota: parseInt(job.quota),
          positionName: job.positionName,
          jobDescription: job.jobDescription,
          qualifications: job.qualifications,
          employmentType: job.employmentType,
          token: localStorage.getItem("userToken"),
          applicationDeadline: new Date(job.applicationDeadline).toISOString(),
        })
        .then((response) => {
          
          if (response.data.success) {
            
            alert(response.data.message);
            
            navigate("/user/list-jobs");
            setJob({
              quota: "",
              company: "",
              location: "",
              postedAt: "",
              positionName: "",
              jobDescription: "",
              qualifications: "",
              employmentType: "",
              applicationDeadline: "",
            });
          } else {
            window.alert(response.data.message);
          }
        });
    }
  };

  const handleKeyDown = (event) => {
    const validCharacters = /^[a-zA-Z0-9]*$/;

    if (!validCharacters.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setJob((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownEmploymentTypeChange = (selectedOption) => {
    setJob((prevState) => ({
      ...prevState,
      employmentType: selectedOption.value,
    }));
  };

  const handleDropdownWorkTypeChange2 = (selectedOption) => {
    setJob((prevState) => ({
      ...prevState,

      workType: selectedOption.value,
    }));
  };

  const checkEmptyFields = () => {
    const requiredFields = [
      "company",
      "location",
      "positionName",
      "employmentType",
      "workType",
    ];

    for (let key of requiredFields) {
      if (!job[key] || (key === "applicationDeadline" && checkFormDate)) {
        return true;
      }
      
    }

    return false;
  };

  const checkDeadline = () => {
    let checkDate;
    const deadlineDate = new Date(job.applicationDeadline);

    
    const currentDate = new Date();

    

    if (currentDate > deadlineDate) {
      checkDate = false;
    } else {
      checkDate = true;
    }
    setCheckFormDate(checkDate);

    return checkDate;
  };

  useEffect(() => {
    setIsValidApplicationDeadline(checkDeadline());
  }, [job.applicationDeadline]);

  useEffect(() => {
    setIsEmpty(checkEmptyFields());
  }, [job]);

  return (
    <div className="w-3/4">
      <div className="container m-5">
        <Form>
          <FormGroup row>
            <Label for="company" sm={2}>
              Company
            </Label>
            <Col sm={10}>
              <Input
                id="company"
                name="company"
                type="text"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="positionName" sm={2}>
              Position
            </Label>
            <Col sm={10}>
              <Input
                id="positionName"
                name="positionName"
                type="text"
                onChange={handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="quota" sm={2}>
              Quota
            </Label>
            <Col sm={10}>
              <Input
                id="quota"
                name="quota"
                type="number"
                onChange={handleInputChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="jobDescription" sm={2}>
              Job Description
            </Label>
            <Col sm={10}>
              <Input
                id="jobDescription"
                name="jobDescription"
                type="textarea"
                className="mt-2"
                onChange={handleInputChange}
                style={{
                  height: "180px",
                }}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="qualifications" sm={2}>
              Job Qualifications
            </Label>
            <Col sm={10}>
              <Input
                id="qualifications"
                name="qualifications"
                type="textarea"
                className="mt-2"
                onChange={handleInputChange}
                style={{
                  height: "180px",
                }}
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
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="employmentType" sm={2}>
              Employment Type
            </Label>
            <Col sm={10}>
              <Dropdown
                id="employmentType"
                name="employmentType"
                onChange={handleDropdownEmploymentTypeChange}
                // onChange={(value) => handleDropdownChange(value, 'employmentType')}
                // onChange={(event) => handleDropdownChange(event.value)}
                options={[
                  { label: "Full-Time", value: "Full-time" },
                  { label: "Part-Time", value: "Part-time" },
                  { label: "Internship", value: "Internship" },
                ]}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="workType" sm={2}>
              Work Type
            </Label>
            <Col sm={10}>
              <Dropdown
                id="workType"
                name="workType"
                onChange={handleDropdownWorkTypeChange2}
                // onChange={(value) => handleDropdownChange(value, 'employmentType')}
                // onChange={(event) => handleDropdownChange(event.value)}
                options={[
                  { label: "Hybrid", value: "Hybrid" },
                  { label: "Remote", value: "Remote" },
                  { label: "Office", value: "Office" },
                ]}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Label for="applicationDeadline" sm={2}>
              Application Deadline
            </Label>
            <Col sm={10}>
              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                type="datetime-local"
                className="mt-2"
                onChange={handleInputChange}
              />
              {isValidApplicationDeadline ? (
                <div></div>
              ) : (
                <div style={{ color: "red" }}>
                  Date value cannot be earlier than the current date
                </div>
              )}
            </Col>
          </FormGroup>

          <FormGroup check row>
            <Col
              sm={{
                offset: 2,
                size: 10,
              }}
            >
              <Button disabled={isEmpty} onClick={() => Submit()}>
                Submit
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
}
