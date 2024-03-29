import axios from "axios";
import { Table } from "reactstrap";
import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";

const AddCandidateToJobModal = ({ candidates, job, onAdd, onClose }) => {
  const [addedCandidates, setAddedCandidates] = useState([]);

  const fetchAddedCandidates = async () => {
    try {
      await axios
        .post(`${process.env.REACT_APP_PORT}/applicant/applicant/jobid`, {
          jobId: job._id,
        })
        .then((res) => {
          // alert(res.data.message);
          console.log(res.data)
          if (res.data.success) {
            const addedCandidatesIds = res.data.candidatesForTheJob.map(
              (applicant) => applicant._id,
            );

            setAddedCandidates(res.data.candidatesForTheJob);

          }
        });
    } catch (error) {
      console.error("Error fetching added candidates:", error);
    }
  };

  const AddApplicant = async (candidateId) => {
    try {
      await axios
        .post(`${process.env.REACT_APP_PORT}/applicant/applicant`, {
          candidateId: candidateId,
          jobId: job._id,
        })
        .then((res) => {
          alert(res.data.message);
          
          if (res.data.success) {
            fetchAddedCandidates();
          }
        });
    } catch (error) {
      console.error("Error adding applicant:", error);
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_PORT}/applicant/applicant`, {
          data: {
            candidateId: candidateId,
            jobId: job._id,
          },
        })
        .then((res) => {
          alert(res.data.message);
          if (res.data.success) {
            fetchAddedCandidates();
          }
        });
      // Eklenmiş adayları yeniden al
    } catch (error) {
      console.error("Error removing applicant:", error);
    }
  };

  const handleAddToJob = () => {
    onAdd(addedCandidates);
    onClose();
  };
  useEffect(() => {
    // Veritabanından eklenmiş adayları al
    fetchAddedCandidates();
  }, []);
  return (
    <Modal size="xl" show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Candidate</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
        <Table >
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Job</th>
              <th></th>
            </tr>
          </thead>

          <tbody >
            
            {candidates.map((candidate) => (
              <tr key={candidate._id}>
                <td>{candidate.fullName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.job}</td>
                <td>
                  {addedCandidates.includes(candidate._id) ? (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveCandidate(candidate._id)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => AddApplicant(candidate._id)}
                    >
                      Add
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default AddCandidateToJobModal;
