import AddHR from "../Screens/AddHR";
import AddJob from "../Screens/AddJob";
import ListHR from '../Screens/ListHR';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react'
import EditJob from "../Screens/EditJob";
import ListJobs from "../Screens/ListJobs";
import ListPool from "../Screens/ListPool";
import Dashboard from "../Screens/Dashboard";
import JobDetail from "../Screens/JobDetail";
import { SideBar } from '../Components/SideBar'
import EditProfile from "../Screens/EditProfile";
import AddCandidate from "../Screens/AddCandidate";
import ListCandidates from '../Screens/ListCandidates';
import ListApplicants from '../Screens/ListApplicants';
import ListJobsPage from '../Screens/ListJobsPage';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Components/Header";


const UserLayout = ({ accessGranted }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();
    const bannedRoutes = ['/user/list-hr', '/user/add-hr',].includes(currentPath);
    useEffect(() => {
        if (bannedRoutes && !accessGranted) {
            navigate("/user/dashboard");
            toast("You do not have permission to access this page", { type: "error" })
        }
    }, [])

    return (
        <Routes>
            {/*<Route path="/dashboard" element={<div className="flex h-full"><SideBar /><Dashboard /></div>} />*/}
            <Route path="/dashboard" element={<div className="h-full"><Header /><Dashboard /></div>} />
            <Route
                path="/add-candidate"
                // element={<div className="flex h-dvh"><SideBar /><AddCandidate /></div>}
                element={<div className="h-dvh"><Header /><AddCandidate /></div>}
            />
            {accessGranted &&
                <>
                    <Route
                        path="/add-hr"
                        element={<div className="justify-between"><Header /><AddHR /><div></div></div>}
                    />
                    <Route
                        path="/list-hr"
                        // element={<div className="flex"><SideBar /><ListHR /></div>}
                        element={<div className="justify-between"><Header /><ListHR /></div>}

                    />
                </>
            }
            <Route
                path="/add-job"
                // element={<div className="flex justify-between"><SideBar /><AddJob /></div>}
                element={<div className="justify-between"><Header /><AddJob /></div>}

            />
            <Route
                path="/list-jobs"
                // element={<div className="flex justify-between"><SideBar /><ListJobs /></div>}
                element={<div className="justify-between"> <Header /><ListJobs /> </div>}
            />

            <Route
                path="/list-jobs-page"
                element={<div><Header /><ListJobsPage /></div>}
            />
            <Route
                path="/edit-job"
                // element={<div className="flex justify-between"><SideBar /><EditJob /></div>}
                element={<div className="justify-between"><Header /><EditJob /></div>}
            />
            <Route
                path="/list-candidates"
                // element={<div className="flex justify-between"><SideBar /><ListCandidates /><div></div></div>}
                element={<div className="justify-between"><Header /><ListCandidates /><div></div></div>}
            />
            <Route
                path="/add-candidate/:id"
                element={<AddCandidate />}
            />
            <Route
                // path="/edit-profile/" element={<div className="flex justify-between"><SideBar /><EditProfile /></div>}
                path="/edit-profile/" element={<div><Header /><div className="flex justify-center"><EditProfile /></div></div>}
            />
            <Route
                // path="/list-applicants/" element={<div className="flex justify-between"><SideBar /><ListApplicants /></div>}
                path="/list-applicants/" element={<div className="justify-between"><Header /><ListApplicants /></div>}
            />
            <Route
                // path="/list-pool" element={<div className="flex justify-between"><SideBar /><ListPool /></div>}
                path="/list-pool" element={<div className="justify-between"><Header /><ListPool /></div>}
            />
            <Route
                // path="/edit-profile/" element={<div className="flex justify-between"><SideBar /><EditProfile /></div>}
                path="/edit-profile/" element={<div className="justify-between"><Header /><EditProfile /></div>}
            />
            <Route
                // path="/job-detail" element={<div className="flex justify-between"><SideBar /><JobDetail /><div></div></div>}
                path="/job-detail" element={<div className="justify-between"><Header /><JobDetail /><div></div></div>}
            />
            {/* <Route path="*" element={<>404</>} /> */}
        </Routes>
    )
}

export default UserLayout