import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Input,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { FormGroup, Col } from "reactstrap";

export default function ListCandidate() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([{
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    phoneCode: "",
    socials: [],
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
  }]);

  const [jobOption, setJobOption] = useState([]);
  //const [statusOption,setStatusOption] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({
    job: [],
    // status: []
  });
  const [showOptions, setShowOptions] = useState({
    job: false,
    //status: false
  });

  const options = {
    job: {
      options: jobOption,
      selectedOptions: selectedOptions.job,
      toggleOptions: () => toggleOptions("job")
    },
    // status: {
    //   options: statusOption,
    //   selectedOptions: selectedOptions.status,
    //   toggleOptions: () => toggleOptions("status")
    // }
  };

  const [search, setSearch] = useState("");
  const TABLE_HEAD = ["Candidate", "Phone", "Job", "Created Date", "", ""];

  const addCandidate = () => {
    navigate("/user/add-candidate");
  };


  const handleOptionChange = (optionType, value) => {
    setSelectedOptions(prevSelectedOptions => ({
      ...prevSelectedOptions,
      [optionType]: prevSelectedOptions[optionType].includes(value)
        ? prevSelectedOptions[optionType].filter(item => item !== value)
        : [...prevSelectedOptions[optionType], value]
    }));
  };

  const toggleOptions = optionType => {
    const newJobOptions = [];
    //const newStatusOptions=[];
    candidates.forEach(element => {
      if (element.job && !newJobOptions.includes(element.job)) {
        newJobOptions.push(element.job);
      }
      // if (element.status.length != 0 && !newStatusOptions.includes(element.status)) {
      //   newStatusOptions.push(element.status);
      // }
    });
    setJobOption(newJobOptions);
    //setStatusOption(newStatusOptions);   

    setShowOptions(prevShowOptions => ({
      ...prevShowOptions,
      [optionType]: !prevShowOptions[optionType]
    }));
  };

  const listCandidates = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_PORT}/candidate/candidate/list`)
        .then((response) => {
          const candidatesArray = response.data.candidates || [];

          setCandidates(candidatesArray)
        });

    } catch (error) {
      console.error('Verileri alma hatası:', error);
    }
  };

  const handleUpdateClick = ({ item }) => {

    if (item && item._id) {
      alert("Adayın sayfasına yönlendiriliyorsunuz")
      const id = item._id;
      navigate("/user/add-candidate", { state: { item } });
    } else {
      console.error("Candidate or _id is undefined.");
    }
  };
  let success = false;
  const Delete = async (item) => {
    const confirmDelete = window.confirm("Bu adayı silmek istediğinizden emin misiniz?");
    if (!confirmDelete) {
      return;
    }
    try {
      const _id = item._id
      await axios
        .delete(`${process.env.REACT_APP_PORT}/candidate/candidate`, { data: { id: _id } })
        .then((response) => {
          //
          if (response.data.success) {
            alert(response.data.message);
            success = true;
            listCandidates();
          } else {
            success = false;
            window.alert(response.data.message);
          }
        });

      if (success && item.cvName) {
        await axios
          .delete(`${process.env.REACT_APP_PORT}/file/file`, { data: { fileName: item.cvName } })
          .then((response) => {
            //
            if (response.data.success) {
              candidates.cvName = "";
              alert("Adaya ait dosyalar temizlendi.");
            } else {
              alert(response.data.message);
            }
          });
      }

    } catch (error) {
      console.error('Aday silinemedi', error);
    }
  };

  const formatDate = (deadline) => {
    const formattedDate = new Date(deadline).toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return formattedDate;
  };

  let filteredCandidates = candidates.filter((candidate => {

    const selectedOptionsValues = Object.values(selectedOptions);

    const anySelected = selectedOptionsValues.some(option => option.length !== 0);

    const allSelected = selectedOptionsValues.every(option => option.length !== 0);


    if (allSelected) {
      return (
        selectedOptions.job.includes(candidate.job) &&
        //selectedOptions.status.includes(candidate.status) &&
        (candidate.fullName.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr')))
      )
    } else if (anySelected) {
      const selectedOptionsWithValues = selectedOptionsValues.filter(optionValues => optionValues.length !== 0);
      let includeCandidate = true;

      for (let i = 0; i < selectedOptionsWithValues.length; i++) {
        const optionKey = Object.keys(selectedOptions).find(key => selectedOptions[key] === selectedOptionsWithValues[i]);
        const optionValues = selectedOptionsWithValues[i];

        if (!optionValues.includes(candidate[optionKey])) {
          includeCandidate = false;
          break;
        }
      }

      return includeCandidate && (
        candidate.fullName.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
      );

    } else {
      return (
        //candidate.fullName.toLowerCase().includes(search.toLowerCase())
          candidate.fullName && candidate.fullName.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))

      )
    }
  }))

  const handleInputChange = (event) => {
    setSearch(event.target.value)
  };

  useEffect(() => {
    listCandidates();
  }, []);


  return (
    <FormGroup>
      <Col >
        <div className="filter-panel bg-white shadow-md p-6 rounded-md mb-5">
          <Typography variant="h6" color="blue-gray" className="font-bold text-2xl">
            Filter Candidates
          </Typography>
          {Object.keys(options).map(optionType => (
            <div key={optionType}>
              <button onClick={options[optionType].toggleOptions} className="filter-option font-semibold">
                {optionType.charAt(0).toUpperCase() + optionType.slice(1)}
              </button>
              {showOptions[optionType] && (
                <div className="filter-options">
                  {options[optionType].options.map(option => (
                    <label className="mr-5 mb-2" key={option}>
                      <input
                        className="mr-2 rounded-full"
                        type="checkbox"
                        name={optionType}
                        value={option}
                        checked={options[optionType].selectedOptions.includes(option)}
                        onChange={() => handleOptionChange(optionType, option)}
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
      <Col >
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Candidate list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all candidates
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm" onClick={() => listCandidates()}>
              view all
            </Button>
            <Button className="flex items-center gap-3" size="sm" onClick={() => addCandidate()} >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add candidate
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            {/* <Button variant="outlined" onClick={() => Search()}> */}
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              onChange={handleInputChange}
            />
            {/* </Button> */}
          </div>
        </div>
        <table className="mt-4 w-full min-w-max table-auto text-left">
        <div style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>

          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((item, index) => {
              const isLast = index === filteredCandidates.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      {(item.gender === "man") ? (
                        <Avatar src={"https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"} size="sm" />

                      ) : (item.gender === "woman") ? (
                        <Avatar src={"https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg"} size="sm" />
                      ) : (
                        <Avatar src={"https://icon-library.com/images/avatar-png-icon/avatar-png-icon-0.jpg"} size="sm" />
                      )}
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.fullName}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {item.email}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {'(' + item.phoneCode + ')' + item.phone}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.job}
                      </Typography>
                    </div>
                  </td>
                  {/* <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={item.status}
                        />
                      </div>
                    </td> */}
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >

                      {formatDate(item.createDate)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Edit Candidate">
                      <IconButton variant="text" onClick={() => handleUpdateClick({ item })}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Delete Candidate">
                      <IconButton variant="text" onClick={() => Delete(item)}>
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            },
            )}
          </tbody>
          </div>
        </table>
        
      </Col>
    </FormGroup>


  );
}
