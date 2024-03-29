import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { SideBar } from "../Components/SideBar";
function Dashboard() {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("userToken");
    const token = localStorage.getItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    if (!token) {
      alert("cıkış başarılı");
      navigate("/home");
    } else {
      alert("logout yapılamadı");
    }
  };

  const addHR = () => {
    navigate("/add-hr");
  };

  const listHR = () => {
    navigate("/list-hr");
  };

  const addCandidate = () => {
    // const navigate = useNavigate();
    navigate("/add-candidate");
  };
  const addJob = () => {
    // const navigate = useNavigate();
    navigate("/add-job");
  };

  const listJobs = () => {
    // const navigate = useNavigate();
    navigate("/list-jobs");
  };

  const listCandidates = () => {
    // const navigate = useNavigate();
    navigate("/list-candidates");
  };

  return (


      <div className=" m-5 "><h1>Dashboard</h1></div>



     
  );
}

export default Dashboard;
