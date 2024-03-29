import axios from "axios";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

export default function EditJob() {
  const location = useLocation();

  const jobId = location.state.job._id;

  const navigate = useNavigate();

  const [job, setJob] = useState({
    quota: "",
    status: "",
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
  const [isValidApplicationDeadline, setIsValidApplicationDeadline] =
    useState();

  const Submit = async () => {
    await axios
      .put(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`, {
        jobId: jobId,
        status: job.status,
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
        applicationDeadline: job.applicationDeadline,
      })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);

          setTimeout(navigate("/user/list-jobs"), 1000);
          setJob({
            quota: "",
            status: "",
            company: "",
            location: "",
            postedAt: "",
            workType: "",
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setJob((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleDropdownChange = (selectedOption) => {
  //   setJob((prevState) => ({
  //     ...prevState,
  //     employmentType: selectedOption.value,
  //   }));
  // };

  // const checkEmptyFields = () => {
  //   const jobValues = Object.values(job);
  //   for (let value of jobValues) {
  //     if (value) {
  //       return true; // Eğer bir özellik boşsa, true döndür
  //     }
  //   }
  //   return false; // Eğer tüm özellikler doluysa, false döndür
  // };

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

  const handleDropdownStatusChange = (selectedOption) => {
    setJob((prevState) => ({
      ...prevState,
      status: selectedOption.value === "true",
    }));
  };

  const checkEmptyFields = () => {
    const requiredFields = [
      "company",
      "location",
      "workType",
      "positionName",
      "employmentType",
    ];

    for (let key of requiredFields) {
      if (!job[key]) {
        return true;
      }
    }
    return false;
  };

  const checkDeadline = () => {
    const deadlineDate = new Date(job.applicationDeadline);
    const currentDate = new Date();
    return !(deadlineDate > currentDate);
  };

  useEffect(() => {
    setIsValidApplicationDeadline(checkDeadline());
  }, [job.applicationDeadline]);

  useEffect(() => {
    setIsEmpty(checkEmptyFields());
  }, [job]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_PORT}/job/jobAdvertisement/id`,
          { jobId: jobId },
        );

        setJob(response.data.jobAdvertisement);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  // const formatDate = (dateTimeString) => {
  //   if (!dateTimeString) {
  //     return "";
  //   }
  //
  //   const dateObject = new Date(dateTimeString);
  //
  //   // Tarih formatını "YYYY-MM-DDTHH:mm" olarak ayarla
  //   const formattedDate = dateObject.toISOString().slice(0, 16);
  //
  //   return formattedDate;
  // };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return "";
    }

    const dateObject = new Date(dateTimeString);

    // Zaman dilimi farkını dikkate alarak, yerel saat dilimine dönüştür
    const localDate = new Date(
      dateObject.getTime() - dateObject.getTimezoneOffset() * 60000,
    );

    // Tarih formatını "YYYY-MM-DDTHH:mm" olarak ayarla
    const formattedDate = localDate.toISOString().slice(0, 16);

    return formattedDate;
  };

  // const formatDate = (deadline) => {
  //   return new Date(deadline).toLocaleString("tr-TR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //   });
  // };

  // const formatDate = (deadline) => {
  //   return new Date(deadline).toLocaleString("tr-TR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //   });
  // };

  return (
    <div className="container m-5">
      <Form>
        <FormGroup row>
          <Label for="company" sm={2}>
            Company
          </Label>
          <Col sm={10}>
            <Input
              id="company"
              defaultValue={job?.company}
              name="company"
              type="text"
              onChange={handleInputChange}
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
              defaultValue={job?.positionName}
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
              defaultValue={job?.quota}
              name="quota"
              type="text"
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
              defaultValue={job?.jobDescription}
              name="jobDescription"
              type="textarea"
              className="mt-2"
              onChange={handleInputChange}
              style={{
                height: "220px",
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
              defaultValue={job?.qualifications}
              name="qualifications"
              type="textarea"
              className="mt-2"
              onChange={handleInputChange}
              style={{
                height: "220px",
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
              defaultValue={job?.location}
              name="location"
              type="text"
              className="mt-2"
              placeholder="City, District"
              onChange={handleInputChange}
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
              // value={jobs?.applicationDeadline}
              defaultValue={formatDate(job?.applicationDeadline)}
              name="applicationDeadline"
              type="datetime-local"
              className="mt-2"
              onChange={handleInputChange}
            />
            {isValidApplicationDeadline ? (
              <div style={{ color: "red" }}>
                Date value cannot be earlier than the current date
              </div>
            ) : (
              <div></div>
            )}
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
              value={job?.employmentType}
              options={[
                { label: "Full-Time", value: "Full-time" },
                { label: "Part-Time", value: "Part-time" },
                { label: "Contract", value: "Contract" },
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
              value={job?.workType}
              options={[
                { label: "Hybrid", value: "Hybrid" },
                { label: "Remote", value: "Remote" },
                { label: "Office", value: "Office" },
              ]}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="status" sm={2}>
            Status
          </Label>
          <Col sm={10}>
            <Dropdown
              id="status"
              name="status"
              onChange={handleDropdownStatusChange}
              value={job?.status.toString().toUpperCase()}
              options={[
                { label: "TRUE", value: "true" },
                { label: "FALSE", value: "false" },
              ]}
            />
          </Col>
        </FormGroup>

        <FormGroup check row>
          <Col
            sm={{
              offset: 2,
              size: 10,
            }}
          >
            <Button
              onClick={() => {
                let result = window.confirm(
                  "Değişiklikleri kaydetmek istediğinizden emin misiniz?",
                );
                if (result) Submit();
              }}
            >
              Submit
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
}
