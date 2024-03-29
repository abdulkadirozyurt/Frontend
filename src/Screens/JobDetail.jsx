import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import KanbanBoard from '../Components/Kanban/KanbanBoard'

export default function JobDetail() {

    const [job, setJob] = useState()
    const [applicants, setApplicants] = useState()
    const [candidate, setCandidate] = useState([])

    let jobId;
    const location = useLocation();
    location.state ? jobId = location.state.job._id : jobId = null

    const getJobById = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_PORT}/job/jobAdvertisement/id`,
                { jobId: jobId }
            );
            const jobData = response.data.jobAdvertisement;
            setJob(jobData);
            const applicantsData = jobData.applicants;
   
            const candidatePromises = applicantsData.map(async (applicantId) => {
                try {
                    const applicantResponse = await axios.post(`${process.env.REACT_APP_PORT}/applicant/applicant/id`, { _id: applicantId });
                    return { applicantId: applicantId, candidate: applicantResponse.data.applicantData };
                } catch (error) {
                    console.error("Error fetching added candidates:", error);
                    return null;
                }
            });
   
            Promise.all(candidatePromises).then((candidates) => {
                const filteredCandidates = candidates.filter(candidate => candidate !== null);
              
                setCandidate(filteredCandidates);
            });
        } catch (error) {
            console.error('Verileri alma hatası:', error);
        }
    };
   
 
 
    useEffect(() => {
      
        const intervalId = setInterval(() => {
            getJobById();
        }, 2000);
   
        return () => clearInterval(intervalId); 
    }, []);
    return (
        (job &&
            <div id="jobDetailKanban">
                <div className="jobDetailKanban">
                    <div className="jobDetailInfo">
                        <div className="kanbanHeader">Company: <span style={{ fontWeight: '600', fontSize: '1.3rem' }}>{job.company}</span></div>
                        <div className="kanbanHeader">Position: <span style={{ fontWeight: '600', fontSize: '1.3rem' }}>{job.positionName}</span></div>
                    </div>
                    <div className="kanbanContainer">
                        <KanbanBoard candidate={candidate} jobId={jobId}></KanbanBoard>
                    </div>
                </div>
            </div>)

    );
}
