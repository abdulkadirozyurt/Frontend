import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Table } from "reactstrap";
import { Card, IconButton, Typography } from "@material-tailwind/react";

import AddCandidateToJobModal from "./AddCandidateToJobModal.jsx";
import { Badge } from "reactstrap";
import { Tooltip } from "antd";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/16/solid";

export default function ListJobs() {
  const tableStyle = {
    textAlign: "center",
  };

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [workOption, setWorkOption] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [positionOption, setPositionOption] = useState([]);
  const [employmentOption, setEmploymentOption] = useState([]);
  const [ShowAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [pageNumber,setPageNumber] = useState("");
  const [pageSize,setPageSize] = useState("");
  const [searchText,setSearchText] = useState("");
  const [sortConditions,setSortConditions] = useState()
  const [filteringConditions,setFilteringConditions] = useState()
  const [filteringColumns,setFilteringColumns] = useState([])


  const [selectedOptions, setSelectedOptions] = useState({
    workType: [],
    positionName: [],
    employmentType: [],
  });

  const [showOptions, setShowOptions] = useState({
    workType: false,
    positionName: false,
    employmentType: false,
  });

  const options = {
    positionName: {
      options: positionOption,
      selectedOptions: selectedOptions.positionName,
      toggleOptions: () => toggleOptions("positionName"),
    },
    employmentType: {
      options: employmentOption,
      selectedOptions: selectedOptions.employmentType,
      toggleOptions: () => toggleOptions("employmentType"),
    },
    workType: {
      options: workOption,
      selectedOptions: selectedOptions.workType,
      toggleOptions: () => toggleOptions("workType"),
    },
  };

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionType]: prevSelectedOptions[optionType].includes(value)
        ? prevSelectedOptions[optionType].filter((item) => item !== value)
        : [...prevSelectedOptions[optionType], value],
    }));
  };

  const toggleOptions = (optionType) => {
    const newPositionOptions = [];
    const newEmployementOptions = [];
    const newWorkType = [];
    jobs.forEach((element) => {
      if (
        element.positionName.length != 0 &&
        !newPositionOptions.includes(element.positionName)
      ) {
        newPositionOptions.push(element.positionName);
      }
      if (
        element.employmentType.length != 0 &&
        !newEmployementOptions.includes(element.employmentType)
      ) {
        newEmployementOptions.push(element.employmentType);
      }
      if (
        element.workType.length != 0 &&
        !newWorkType.includes(element.workType)
      ) {
        newWorkType.push(element.workType);
      }
    });
    setPositionOption(newPositionOptions);
    setEmploymentOption(newEmployementOptions);
    setWorkOption(newWorkType);

    setShowOptions((prevShowOptions) => ({
      ...prevShowOptions,
      [optionType]: !prevShowOptions[optionType],
    }))
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement/list`,{filteringConditions:filteringConditions,searchText:searchText,sortConditions:sortConditions,pageSize:pageSize,pageNumber:pageNumber});

      const jobsArray = response.data.jobAdvertisements || [];

      setJobs(jobsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      let columns=[]
      columns.push("workType")
      columns.push("employmentType")
      columns.push("positionName")

setFilteringColumns(columns)
console.log("cc",filteringColumns)
      const response = await axios.post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement/filter`,{columnName:filteringColumns});

      const jobsArray = response.data.filterOptions || [];
console.log(jobsArray)
      ///setJobs(jobsArray);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PORT}/candidate/candidate/list`,
      );

      const candidatesArray = response.data.candidates || [];
      setCandidates(candidatesArray);
    } catch (error) {}
  };

  const deleteJob = async (_id) => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`, {
          data: { id: _id },
        })
        .then((response) => {
          //
          if (response.data.success) {
            fetchJobs();
          } else {
            window.alert(response.data.message);
          }
        });
    } catch (error) {
      console.error("İş İlanı silinemedi", error);
    }
  };

  const editJob = (job) => {
    navigate("/user/edit-job", { state: { job } });
  };

  const jobDetails = (job) => {
    console.log(job)
    if (job && job._id) {
      navigate("/user/job-detail", { state: { job } });
    } else {
      console.error("Job or _id is undefined.");
    }
  };

  // const formatDate = (deadline) => {
  //   const formattedDate = new Date(deadline).toLocaleString("tr-TR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //   });
  //   return formattedDate;
  // };



  const formatDateTime=(deadline)=>{
    const applicationDeadline= new Date(deadline);
    const formattedDeadline= applicationDeadline.toLocaleDateString()+" "+applicationDeadline.toLocaleTimeString([],{hour:"2-digit", minute:"2-digit"});

    return formattedDeadline;
  }

  const handleSearch = (event) => {
    setSearchText(event.target.value)

    //setSearchTerm(event.target.value);
  };

  const handleAddCandidate = (job) => {
    setSelectedJob(job);

    setShowAddCandidateModal(true);
  };

  const handleCloseModal = () => {
    setShowAddCandidateModal(false);
  };

  const handleAddCandidateToJob = async (addedUsers) => {
    try {
      // const response = await axios.post(`${process.env.REACT_APP_PORT}/applicant/applicant`)
      // .then(response){
      // }
    } catch (error) { }
  };

  const filteredJobs = jobs.filter((job) => {
    // const positionMatch =  selectedOptions.positionName.includes(job.positionName);
    // const employmentMatch =  selectedOptions.employmentType.includes(job.employmentType)
    // const workMatch =  selectedOptions.workType.includes(job.workType);

    const selectedOptionsValues = Object.values(selectedOptions);

    const anySelected = selectedOptionsValues.some(
      (option) => option.length !== 0,
    );

    const allSelected = selectedOptionsValues.every(
      (option) => option.length !== 0,
    );

    if (allSelected) {
      return (
        selectedOptions.positionName.includes(job.positionName) &&
        selectedOptions.employmentType.includes(job.employmentType) &&
        selectedOptions.workType.includes(job.workType) &&
        (job.company.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr')) ||
          job.positionName.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr')))
      );
    } else if (anySelected) {
      const selectedOptionsWithValues = selectedOptionsValues.filter(
        (optionValues) => optionValues.length !== 0,
      );
      let includeJob = true;

      for (let i = 0; i < selectedOptionsWithValues.length; i++) {
        const optionKey = Object.keys(selectedOptions).find(
          (key) => selectedOptions[key] === selectedOptionsWithValues[i],
        );
        const optionValues = selectedOptionsWithValues[i];

        if (!optionValues.includes(job[optionKey])) {
          includeJob = false;
          break;
        }
      }

      return (
        includeJob &&
        (job.company.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr')) ||
          job.positionName.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr')))
      );
    } else {
      return (
        job.company.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr')) ||
        job.positionName.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
      );
    }
  });

  const TABLE_HEAD = Object.keys(jobs[0] || {}).filter(
    (field) =>
      field !== "_id" &&
      field !== "jobDescription" &&
      field !== "qualifications" &&
      field !== "applicants" &&
      field !== "acceptedApplicationsCount" &&
      field !== "postedAt" &&
      field !== "__v",
  );

  const sortTableHeads = (TABLE_HEAD) => {
    const sortedTableHeads = [
      "positionName",
      "company",
      "quota",
      // ... Diğer sıralanmış başlıklar buraya eklenebilir
    ];

    // TABLE_HEAD içindeki başlıkları sıralanmış başlık listesine ekleme
    TABLE_HEAD.forEach((head) => {
      if (!sortedTableHeads.includes(head)) {
        sortedTableHeads.push(head);
      }
    });

    return sortedTableHeads;
  };

  const table_heads = sortTableHeads(TABLE_HEAD);

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
    fetchFilterOptions();
  }, [searchText]);

  return (
    <div>
      <FormGroup>
        <Col>
          <div className="filter-panel bg-white shadow-md p-5 rounded-md">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-bold text-2xl"
            >
              Filter Positions
            </Typography>
            {Object.keys(options).map((optionType) => (
              <div key={optionType} className="mb-3">
                <button
                  onClick={options[optionType].toggleOptions}
                  className="filter-option font-semibold "
                >
                  {optionType.charAt(0).toUpperCase() + optionType.slice(1)}
                </button>
                {showOptions[optionType] && (
                  <div className="filter-options">
                    {options[optionType].options.map((option) => (
                      <label className="mr-5 mb-2" key={option}>
                        <input
                          className="mr-2 rounded-full"
                          type="checkbox"
                          name={optionType}
                          value={option}
                          checked={options[optionType].selectedOptions.includes(
                            option,
                          )}
                          onChange={() =>
                            handleOptionChange(optionType, option)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Col>
        <Col>
          <div className="mr-5">
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Search..."
                //value={searchTerm}
                onChange={handleSearch}
                style={{ width: "200px" }}
              />
            </div>

            <Table
              style={tableStyle}
              className="mt-4 min-w-80 table-auto text-left"
              striped
            >
              <thead>
                <tr>
                  {table_heads.map((head) => (
                    <th
                      key={head}
                      className="border-b  border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        // variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head.toUpperCase()}
                      </Typography>
                    </th>
                  ))}
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      // variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      ACTIONS
                    </Typography>
                  </th>
                </tr>
              </thead>

              <tbody className="h-full">
                {filteredJobs.map((job) => (
                  <tr key={job._id} style={{ whiteSpace: "normal" }}>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.positionName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.company}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.quota}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.location}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.contactEmail}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.contactPhone}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatDateTime(job.applicationDeadline)}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.status === true ? (
                          <Badge color={"success"}>
                            {/*{job.status.toString().toUpperCase()}*/}
                            OPEN
                          </Badge>
                        ) : (
                          <Badge color={"danger"}>
                            {/*{job.status.toString().toUpperCase()}*/}
                            CLOSED
                          </Badge>
                        )}
                      </Typography>
                    </td>
                    {/*<td>*/}
                    {/*  <Typography*/}
                    {/*    variant="small"*/}
                    {/*    color="blue-gray"*/}
                    {/*    className="font-normal"*/}
                    {/*  >*/}
                    {/*    {formatDate(job.postedAt)}*/}
                    {/*  </Typography>*/}
                    {/*</td>*/}

                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.workType}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job.employmentType}
                      </Typography>
                    </td>

                    <td>
                      <Tooltip content="Add Candidate">
                        <IconButton
                          variant="text"
                          onClick={() => handleAddCandidate(job)}
                        >
                          <PlusCircleIcon className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Add Candidate">
                        <IconButton variant="text" onClick={() => editJob(job)}>
                          <PencilIcon className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Add Candidate">
                        <IconButton
                          variant="text"
                          onClick={() => jobDetails(job)}
                        >
                          <DocumentMagnifyingGlassIcon className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Add Candidate">
                        <IconButton
                          variant="text"
                          onClick={() => deleteJob(job._id)}
                        >
                          <TrashIcon className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {ShowAddCandidateModal && (
              <AddCandidateToJobModal
                job={selectedJob}
                candidates={candidates}
                // onAdd={handleUpdate}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </Col>
      </FormGroup>
    </div>
  );
}
