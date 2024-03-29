import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { IoPeople } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../style/style.css"
export function SideBar() {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState();

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const logOut = () => {
    localStorage.removeItem("userToken");
    const token = localStorage.getItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    if (!token) {
      alert("exit succesfully");
      navigate("/login");
    } else {
      alert("exit failed");
    }
  };

  const editProfile=()=>{
    navigate("/user/edit-profile")
  }

  const addHR = () => {
    navigate("/user/add-hr");
  };

  const listHR = () => {
    navigate("/user/list-hr");
  };

  const addJob = () => {
    navigate("/user/add-job");
  };

  const listJobs = () => {
    navigate("/user/list-jobs");
  };

  const listCandidates = () => {
    navigate("/user/list-candidates");
  };

  const listApplicants = () => {
    navigate("/user/list-applicants");
  };  
  const listPools = () => {
    navigate("/user/list-pool");
  };
  const goDashboard = () => {
    navigate("/user/dashboard");
  };

  return (
    <div className={"side-bar"}>
      <Card className="min-h-screen">
        <div className="p-4 ">
          <Typography variant="h3" color="blue-gray">
            ATS
          </Typography>
        </div>
        <List>
          <ListItem onClick={() => editProfile()}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem onClick={() => goDashboard()}>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
          {userRole === "admin" && (
            <>
              <ListItem onClick={() => addHR()}>
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Add HR
              </ListItem>
              <ListItem onClick={() => listHR()}>
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                List HR
              </ListItem>
            </>
          )}
          <ListItem onClick={() => addJob()}>
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Add Position
          </ListItem>
          <ListItem onClick={() => listJobs()}>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Positions
            {/* <ListItemSuffix>
            <Chip
              value="13"
              size="sm"
              variant="ghost"
              color="blue-gray"
              className="rounded-full"
            />
          </ListItemSuffix> */}
          </ListItem>
          <ListItem onClick={() => listCandidates()}>
            <ListItemPrefix>
              <IoPeople className="h-5 w-5" />
            </ListItemPrefix>
            Candidate
          </ListItem>
          <ListItem onClick={() => listApplicants()}>
            <ListItemPrefix>
              <IoPeople className="h-5 w-5" />
            </ListItemPrefix>
            Applicants
          </ListItem>

        
        <ListItem onClick={() => listPools()}>
          <ListItemPrefix>
            <IoPeople className="h-5 w-5" />
          </ListItemPrefix>
          Pools
        </ListItem>
        

          <ListItem onClick={() => logOut()}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    </div>
  );
}
