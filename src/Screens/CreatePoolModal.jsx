import axios from "axios";
import { FormGroup, Table } from "reactstrap";
import { Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import {
    Typography,
    Button
  } from "@material-tailwind/react";
import { Col } from "antd";

const CreatePoolModal = ({onClose}) => {

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
        createDate: "",
        job: "",
        gender: "",
        cvName: ""
      }]);
  
    const TABLE_HEAD = ["Candidate", "Job", "Skills"];
    const [skillOption, setSkillOption] = useState([]);
  
    const [selectedOptions, setSelectedOptions] = useState({
        technicalSkills: [],
    });
    const [showOptions, setShowOptions] = useState({
        technicalSkills: false,
    });
  
    const options = {
      technicalSkills: {
        options: skillOption,
        selectedOptions: selectedOptions.technicalSkills,
        toggleOptions: () => toggleOptions("technicalSkills")
      },
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
        const allTechnicalSkills = candidates.flatMap(candidate => candidate.technicalSkills);
        const uniqueSkills = [...new Set(allTechnicalSkills)];
      
        setSkillOption(uniqueSkills);
      
        setShowOptions(prevShowOptions => ({
          ...prevShowOptions,
          [optionType]: !prevShowOptions[optionType]
        }));
    };          

    const listCandidates = async () => {
        try {
          await axios
            .get(`${process.env.REACT_APP_PORT}/candidate/candidate`)
            .then((response) => {
              const candidatesArray = response.data.candidates || [];
    
              setCandidates(candidatesArray)
            });
    
        } catch (error) {
          console.error('Verileri alma hatası:', error);
        }
    }; 

    let filteredCandidates = candidates.filter(candidate => {
        
        const selectedOptionsValues = Object.values(selectedOptions);
        const selectedSkills = selectedOptionsValues.flatMap(option => option);
        
        if(selectedSkills.length){
            return selectedSkills.some(skill => candidate.technicalSkills.includes(skill));
        }

        return true;
        
    });

    const createPool = async () => {
        try {
          if(selectedOptions.technicalSkills.length == 0){
            console.log("aaaaaa")
            alert("Please select skill")
          }else{
            var candidatesIds=[]

            filteredCandidates.forEach(candidate => {
              candidatesIds.push(candidate._id)
            });
  
            const poolName = selectedOptions.technicalSkills.join(",");
  
            await axios
              .post(`${process.env.REACT_APP_PORT}/talentpool/talentPool`, {poolName: poolName ,candidates:candidatesIds})
              .then((response) => {
                  alert(response.data.message);
              });
          }
          
    
        } catch (error) {
          alert(error);
        }
    }; 

    useEffect(() => {
        listCandidates();
    }, []);
    
    
  return (
    <Modal size="xl" show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Candidate To Pool</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      <div className="filter-panel bg-white shadow-md p-6 rounded-md mb-5">
        <FormGroup>
            <Col>
                <Typography variant="h6" color="blue-gray" className="font-bold text-2xl">
                        Choose Skill
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
            </Col>
           <Col >
                <Button className="flex items-center gap-3"  size="sm" onClick={() => createPool()}>
                    Create Pool
                </Button>
           </Col>
        </FormGroup>
                
        </div>
        <table className="mt-4 w-full min-w-max table-auto text-left">
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
                        {item.job}
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
                        {item.technicalSkills.join(', ')}
                      </Typography>
                    </div>
                  </td>
                </tr>
              );
            },
            )}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePoolModal;
