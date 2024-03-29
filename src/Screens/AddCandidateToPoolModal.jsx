import axios from "axios";
import { Table } from "reactstrap";
import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const AddCandidateToPoolModal = ({poolId,onClose}) => {
  const [addedCandidates, setAddedCandidates] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const fetchAddedCandidates = async () => {
    try {

      await axios
      .post(`${process.env.REACT_APP_PORT}/talentpool/talentPool/id`, { poolId: poolId })
      .then((response) => {
        const talentPoolData = response.data.arrTalentPool; 

        const candidatesData = talentPoolData.map(pool => pool.candidates).flat();
 
        setAddedCandidates(candidatesData);
      });

    } catch (error) {
      console.error("Error fetching added candidates:", error);
    }
  };

  const AddApplicant = async (candidateId) => {
    try {
      await axios
        .post(`${process.env.REACT_APP_PORT}/talentpool/talentPoolAddCandidate`, {
          candidateId: candidateId,
         poolId:poolId
        })
        .then((res) => {
       fetchCandidates(); 
       fetchAddedCandidates()      
        });
    } catch (error) {
      console.error("Error adding applicant:", error);
    }
  };



  const fetchCandidates =async()=>{
    await axios
    .get(`${process.env.REACT_APP_PORT}/candidate/candidate`)
    .then((res) => {

   setCandidates(res.data.candidates)
    });
  }
  useEffect(() => {
    
    fetchCandidates();
    fetchAddedCandidates()
  }, []);
  return (
    <Modal size="xl" show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Candidate</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      <Table>
  <thead>
    <tr>
      <th>Full Name</th>
      <th>Email</th>
      <th>Job</th>
      <th></th>
    </tr>
  </thead>

  <tbody>
  {candidates.map((candidate) => {

    if (addedCandidates.some((addedCandidate) => addedCandidate.candidateId === candidate._id)) {
      return null;
    }

    return (
      <tr key={candidate._id}>
        <td>{candidate.fullName}</td>
        <td>{candidate.email}</td>
        <td>{candidate.job}</td>
        <td>
          <Button
            variant="primary"
            onClick={() => AddApplicant(candidate._id)}
          >
            Add
          </Button>
        </td>
      </tr>
    );
  })}
</tbody>


</Table>

      </Modal.Body>
    </Modal>
  );
};

export default AddCandidateToPoolModal;
