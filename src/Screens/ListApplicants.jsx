import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Col, FormGroup, Table } from "reactstrap";
import { IconButton, Tooltip, Typography } from "@material-tailwind/react";

export default function ListApplicants() {
  const [applicants, setApplicants] = useState([
    {
      status: "",
      companyName: "",
      positionName: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      applicationDate: "",
      candidatePhoneCode: "",
    },
  ]);

  const fetchApplicants = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_PORT}/applicant/applicant/list`,{pageNumber:1,pageSize:1})
        .then((response) => {
          console.log(response.data.success)
          console.log(response.data.applicantsData)

          const applicantsArray = response.data.applicants || [];
          setApplicants(applicantsArray);
        });
    } catch (error) {
      
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

  const Delete = async (item) => {
    const confirmDelete = window.confirm("Bu adayı silmek istediğinizden emin misiniz?");

    await axios
        .delete(`${process.env.REACT_APP_PORT}/applicant/applicant`, {
          data: { jobId: item.jobId, candidateId: item.candidateId },
        })
        .then((response) => {
          
          if (response.data.success){
            alert(response.data.message);
            fetchApplicants()
          }else {
            window.alert(response.data.message)
          }
          
          
          
        });
  };

  useEffect(() => {
    fetchApplicants();
    
  }, []);


  const TABLE_HEAD = [
    "Candidate",
    "Email",
    "Phone",
    "Company",
    "Position",
    "Application Date",
    "Status",
  ];

  return (
    <div className="container m-10">
      <FormGroup row>
        <Col sm={5} md={10} lg={10}>
          <div className="ml-1 ">
            <Table className="mt-4 min-w-80 table-auto text-left" striped>
              <thead>
                <tr >
                  {TABLE_HEAD.map((head) => (
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
                </tr>
              </thead>

              <tbody className="h-full">
                {applicants.map((applicant) => (
                  <tr key={applicant._id} style={{ whiteSpace: "normal" }}>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {applicant.candidateName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {applicant.candidateEmail}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {applicant.candidatePhoneCode +
                          applicant.candidatePhone}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {applicant.companyName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {applicant.positionName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatDate(applicant.applicationDate)}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {applicant.status}
                      </Typography>
                    </td>
                    <td /*className={classes}*/>
                      <Tooltip content="Delete Candidate">
                        <IconButton
                          variant="text"
                          onClick={() => Delete(applicant)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>


                    {/* <td>
                    <div className="flex">
                      <Button
                        className="btn btn-warning mr-2"
                        onClick={() => editJob(job)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn btn-danger"
                        onClick={() => {
                          let result = window.confirm(
                            "Bu iş ilanını silmek istediğinize emin misiniz?"
                          );
                          if (result) {
                            deleteJob(job._id);
                          }
                        }}
                      >
                        Delete
                      </Button>

                      <Button
                        className="btn btn-success mr-2 ml-2"
                        onClick={() => handleAddCandidate(job)}
                      >
                        Add Candidate
                      </Button>
                    </div>
                  </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </FormGroup>
    </div>
  );
}
