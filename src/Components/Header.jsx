import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoIcon from "../images/LogoIcon.png";
import HRHUB from "../images/HRHUB.png";
import fullLogo from "../images/HRHLogo.png";
import SubtractLeft from "../images/LeftSubtract.png";
import SubtractRight from "../images/RightSubtract.png";
import MenuItemInline from "react";
import { MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Dropdown, Space, Menu, ConfigProvider } from "antd";
// import {Menu} from "@material-tailwind/react";
import "../style/style.css";
import axios from "axios";

export function Header() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [isHrOpen, setIsHrsOpen] = useState(false);
  const [isPoolsOpen, setIsPoolsOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCandidateOpen, setIsCandidateOpen] = useState(false);
  const [isApplicantOpen, setIsApplicantOpen] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    phoneCode: "",
  });

  const logOut = () => {
    localStorage.removeItem("userToken");
    const token = localStorage.getItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    if (!token) {
      alert("exit succesfully");
      // navigate("/login");
    } else {
      alert("exit failed");
    }
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    const fetchUser = async () => {
      try {
        await axios
          .post(
            `${process.env.REACT_APP_PORT}/user/getUser/id`,
            {},
            {
              headers: {
                Authorization: `Bearer: ${token}`,
              },
            },
          )
          .then((response) => {
            if (response.data.success) {
              let userData = response.data.user;
              setUser(userData);

              console.log(response);
              console.log("userData:", userData);
              console.log("user:", user);
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const itemsHr = [
    {
      label: <Link to="/user/add-hr">Add HR</Link>,
      key: "0",
    },
    {
      label: <Link to="/user/list-hr">List HR</Link>,
      key: "1",
    },
  ];

  const itemsPosition = [
    {
      label: <Link to="/user/add-job">Add Position</Link>,
      key: "0",
    },
    {
      label: <Link to="/user/list-jobs-page">List Positions</Link>,
      key: "1",
    },
  ];

  const itemsCandidate = [
    {
      label: <Link to="/user/add-candidate">Add Candidate</Link>,
      key: "0",
    },
    {
      label: <Link to="/user/list-candidates">List Candidates</Link>,
      key: "1",
    },
  ];

  const itemsApplicant = [
    {
      label: <Link to="/user/list-applicants">List Applicants</Link>,
      key: "0",
    },
  ];

  const itemsPool = [
    {
      label: <Link to="/user/list-pool">List Pools</Link>,
      key: "0",
    },
  ];

  return (
    <div style={{ fontFamily: "SF Pro Text!important" }}>
      {/*HEADER*/}
      <div
        style={{
          width: "100%",
          height: "78px",
          paddingTop: 24,
          paddingBottom: 11,
          paddingLeft: 24,
          paddingRight: 24,
          background: "#E6F4FF",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 21,
            display: "flex",
          }}
        >
          <div
            style={{
              width: 132.96,
              height: 32,
              justifyContent: "center",
              alignItems: "center",
              gap: 6.86,
              display: "flex",
            }}
          >
            <div style={{ width: 32, height: 32 }}>
              {/*<img src={LogoIcon}/>*/}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M25.6 12.8C29.1292 12.8 32 9.92913 32 6.4C32 2.87087 29.1291 0 25.6 0C23.0373 0 20.8276 1.51747 19.8065 3.6982L18.0927 3.0656C18.113 2.9344 18.1333 2.80313 18.1333 2.66667C18.1333 1.19633 16.937 0 15.4667 0C13.9963 0 12.8 1.19633 12.8 2.66667C12.8 4.137 13.9963 5.33333 15.4667 5.33333C16.4219 5.33333 17.2549 4.824 17.7258 4.0672L19.4367 4.69867C19.2865 5.24167 19.2 5.81013 19.2 6.4C19.2 7.09867 19.3161 7.76953 19.5242 8.39947L13.6586 10.8855C12.5846 8.85487 10.4529 7.46667 8 7.46667C7.2052 7.46667 6.44687 7.61933 5.744 7.88487L4.26873 4.78467C4.9114 4.29713 5.33333 3.53333 5.33333 2.66667C5.33333 1.19633 4.137 0 2.66667 0C1.19633 0 0 1.19633 0 2.66667C0 4.137 1.19633 5.33333 2.66667 5.33333C2.88853 5.33333 3.10133 5.2982 3.3078 5.24633L4.78127 8.34347C2.882 9.45493 1.6 11.5115 1.6 13.8667C1.6 16.0789 2.72867 18.0315 4.4396 19.1813L3.464 20.9349C3.21013 20.8549 2.946 20.8 2.66667 20.8C1.19633 20.8 0 21.9963 0 23.4667C0 24.937 1.19633 26.1333 2.66667 26.1333C4.137 26.1333 5.33333 24.937 5.33333 23.4667C5.33333 22.6591 4.96487 21.943 4.39633 21.4539L5.37393 19.6966C6.17607 20.0597 7.06353 20.2667 8 20.2667C9.46353 20.2667 10.8097 19.7675 11.8891 18.9375L13.9883 21.2469C12.9237 22.3903 12.2667 23.918 12.2667 25.6C12.2667 25.9263 12.2992 26.2443 12.3461 26.5573L9.87634 27.1435C9.45133 26.2347 8.53434 25.6 7.46667 25.6C5.99633 25.6 4.8 26.7963 4.8 28.2667C4.8 29.737 5.99633 30.9333 7.46667 30.9333C8.937 30.9333 10.1333 29.737 10.1333 28.2667C10.1333 28.2373 10.1253 28.2097 10.1247 28.1802L12.5899 27.5959C13.4305 30.1497 15.8347 32 18.6667 32C22.1959 32 25.0667 29.1291 25.0667 25.6C25.0667 24.5057 24.7899 23.4753 24.3033 22.574L27.4362 20.537C27.9206 21.0277 28.5914 21.3333 29.3333 21.3333C30.8037 21.3333 32 20.137 32 18.6667C32 17.1963 30.8037 16 29.3333 16C27.863 16 26.6667 17.1963 26.6667 18.6667C26.6667 19.0112 26.7375 19.3385 26.857 19.6411L23.7169 21.6825C23.0852 20.8699 22.2678 20.2207 21.3333 19.7893L23.9365 12.5729C24.4677 12.7161 25.0239 12.8 25.6 12.8ZM15.4667 4.26667C14.5847 4.26667 13.8667 3.54867 13.8667 2.66667C13.8667 1.78467 14.5847 1.06667 15.4667 1.06667C16.3487 1.06667 17.0667 1.78467 17.0667 2.66667C17.0667 3.54867 16.3487 4.26667 15.4667 4.26667ZM1.06667 2.66667C1.06667 1.78467 1.78467 1.06667 2.66667 1.06667C3.54867 1.06667 4.26667 1.78467 4.26667 2.66667C4.26667 3.54867 3.54867 4.26667 2.66667 4.26667C1.78467 4.26667 1.06667 3.54867 1.06667 2.66667ZM2.66667 25.0667C1.78467 25.0667 1.06667 24.3487 1.06667 23.4667C1.06667 22.5847 1.78467 21.8667 2.66667 21.8667C3.54867 21.8667 4.26667 22.5847 4.26667 23.4667C4.26667 24.3487 3.54867 25.0667 2.66667 25.0667ZM7.46667 29.8667C6.58467 29.8667 5.86667 29.1487 5.86667 28.2667C5.86667 27.3847 6.58467 26.6667 7.46667 26.6667C8.34867 26.6667 9.06667 27.3847 9.06667 28.2667C9.06667 29.1487 8.34867 29.8667 7.46667 29.8667ZM29.3333 17.0667C30.2153 17.0667 30.9333 17.7847 30.9333 18.6667C30.9333 19.5487 30.2153 20.2667 29.3333 20.2667C28.4513 20.2667 27.7333 19.5487 27.7333 18.6667C27.7333 17.7847 28.4513 17.0667 29.3333 17.0667ZM22.4591 10.7008C22.6971 9.4672 23.7847 8.53333 25.0667 8.53333H26.1333C27.4153 8.53333 28.5029 9.4672 28.7409 10.7008C27.8587 11.3466 26.775 11.7333 25.6 11.7333C24.425 11.7333 23.3414 11.3467 22.4591 10.7008ZM25.6 7.46667C24.718 7.46667 24 6.74867 24 5.86667C24 4.98467 24.718 4.26667 25.6 4.26667C26.482 4.26667 27.2 4.98467 27.2 5.86667C27.2 6.74867 26.482 7.46667 25.6 7.46667ZM25.6 1.06667C28.5409 1.06667 30.9333 3.45913 30.9333 6.4C30.9333 7.73333 30.4377 8.95153 29.6255 9.88753C29.2518 8.9034 28.4727 8.118 27.5018 7.7302C27.974 7.24893 28.2667 6.592 28.2667 5.86667C28.2667 4.39633 27.0703 3.2 25.6 3.2C24.1297 3.2 22.9333 4.39633 22.9333 5.86667C22.9333 6.59193 23.226 7.24893 23.6982 7.7302C22.7273 8.118 21.9482 8.9034 21.5745 9.88753C20.7623 8.95153 20.2667 7.73333 20.2667 6.4C20.2667 3.45913 22.6591 1.06667 25.6 1.06667ZM2.66667 13.8667C2.66667 10.9258 5.05913 8.53333 8 8.53333C10.9409 8.53333 13.3333 10.9258 13.3333 13.8667C13.3333 15.2042 12.8347 16.4255 12.0182 17.3627C11.6459 16.375 10.8651 15.5857 9.89167 15.1969C10.3633 14.7156 10.656 14.0586 10.656 13.3333C10.656 11.863 9.45967 10.6667 7.98933 10.6667C6.519 10.6667 5.32267 11.863 5.32267 13.3333C5.32267 14.0586 5.61533 14.7156 6.08747 15.1969C5.11953 15.5829 4.34147 16.3653 3.9664 17.3455C3.15887 16.4107 2.66667 15.1964 2.66667 13.8667ZM6.38933 13.3333C6.38933 12.4513 7.10733 11.7333 7.98933 11.7333C8.87133 11.7333 9.58933 12.4513 9.58933 13.3333C9.58933 14.2153 8.87133 14.9333 7.98933 14.9333C7.10733 14.9333 6.38933 14.2153 6.38933 13.3333ZM4.85027 18.1604C5.0906 16.9302 6.17653 16 7.456 16H8.52267C9.807 16 10.8967 16.937 11.1313 18.1745C10.2508 18.8165 9.1706 19.2 8 19.2C6.8208 19.2 5.73387 18.8107 4.85027 18.1604ZM15.5169 29.8937C15.7573 28.6635 16.8432 27.7333 18.1227 27.7333H19.1893C20.4737 27.7333 21.5633 28.6703 21.7979 29.9078C20.9175 30.5498 19.8373 30.9333 18.6667 30.9333C17.4875 30.9333 16.4005 30.544 15.5169 29.8937ZM18.656 26.6667C17.774 26.6667 17.056 25.9487 17.056 25.0667C17.056 24.1847 17.774 23.4667 18.656 23.4667C19.538 23.4667 20.256 24.1847 20.256 25.0667C20.256 25.9487 19.538 26.6667 18.656 26.6667ZM24 25.6C24 26.9375 23.5013 28.1589 22.6849 29.0961C22.3125 28.1083 21.5318 27.319 20.5583 26.9302C21.0299 26.4489 21.3227 25.7919 21.3227 25.0667C21.3227 23.5963 20.1263 22.4 18.656 22.4C17.1857 22.4 15.9893 23.5963 15.9893 25.0667C15.9893 25.7919 16.282 26.4489 16.7541 26.9302C15.7862 27.3162 15.0081 28.0987 14.6331 29.0789C13.8255 28.144 13.3333 26.9297 13.3333 25.6C13.3333 22.6591 15.7258 20.2667 18.6667 20.2667C21.6075 20.2667 24 22.6591 24 25.6ZM20.3302 19.4271C19.7989 19.2839 19.2427 19.2 18.6667 19.2C17.2031 19.2 15.857 19.6992 14.7776 20.5292L12.6784 18.2198C13.743 17.0763 14.4 15.5487 14.4 13.8667C14.4 13.168 14.2839 12.4971 14.0758 11.8672L19.9414 9.3812C20.5985 10.6235 21.6529 11.6203 22.9339 12.2107L20.3302 19.4271Z"
                  fill="url(#paint0_linear_1284_1716)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1284_1716"
                    x1="16"
                    y1="0"
                    x2="16"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#0057D9" />
                    <stop offset="1" stop-color="#001B43" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/*<div style={{width: 94.10, height: 20.43, position: 'relative'}}>*/}
            {/*    /!*<div style={{width: 15.62, height: 20.34, left: 78.48, top: -0, position: 'absolute', background: '#011C46'}}></div>*!/*/}
            {/*    /!*<div style={{width: 16.58, height: 20.43, left: 58.17, top: -0, position: 'absolute', background: '#011C46'}}></div>*!/*/}
            {/*    /!*<div style={{width: 15.77, height: 20.34, left: 38.19, top: -0, position: 'absolute', background: '#011C46'}}></div>*!/*/}
            {/*    /!*<div style={{width: 14.57, height: 20.34, left: 20.09, top: -0, position: 'absolute', background: '#011C46'}}></div>*!/*/}
            {/*    /!*<div style={{width: 15.77, height: 20.34, left: 0, top: 0, position: 'absolute', background: '#011C46'}}></div>*!/*/}
            {/*    <img src={HRHUB}/>*/}
            {/*</div>*/}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="95"
              height="22"
              viewBox="0 0 95 22"
              fill="none"
            >
              <path
                d="M80.5908 21.1272C80.2411 21.1272 79.9691 21.0592 79.7748 20.9232C79.5999 20.8066 79.4834 20.6317 79.4251 20.3986C79.3668 20.146 79.3376 19.874 79.3376 19.5826V2.27172C79.3376 1.98029 79.3668 1.72772 79.4251 1.514C79.5028 1.28086 79.6291 1.106 79.8039 0.98943C79.9982 0.853431 80.2702 0.785431 80.6199 0.785431H88.7508C89.8388 0.785431 90.7908 1.02829 91.6068 1.514C92.4422 1.99972 93.0931 2.66029 93.5594 3.49572C94.0257 4.33115 94.2491 5.24429 94.2297 6.23515C94.2491 6.74029 94.1908 7.23572 94.0548 7.72144C93.9188 8.20715 93.7148 8.66372 93.4428 9.09115C93.1902 9.49915 92.8696 9.83915 92.4811 10.1112C93.0056 10.4414 93.4525 10.8689 93.8217 11.3934C94.1908 11.918 94.4725 12.5009 94.6668 13.142C94.8611 13.7832 94.9582 14.4534 94.9582 15.1529C94.9388 15.9883 94.7834 16.7752 94.4919 17.5134C94.2005 18.2323 93.7828 18.8637 93.2388 19.4077C92.6948 19.9517 92.0634 20.3792 91.3445 20.69C90.6256 20.9814 89.8582 21.1272 89.0422 21.1272H80.5908ZM81.9605 18.6209H88.7508C89.5085 18.6209 90.1594 18.4752 90.7034 18.1837C91.2474 17.8923 91.6651 17.4649 91.9565 16.9014C92.2479 16.338 92.3936 15.6483 92.3936 14.8323C92.3936 14.1329 92.2965 13.5694 92.1022 13.142C91.9079 12.7146 91.6456 12.394 91.3154 12.1803C90.9851 11.9472 90.6257 11.782 90.2371 11.6849C89.8679 11.5877 89.4988 11.5392 89.1297 11.5392C88.7799 11.5197 88.4594 11.51 88.1679 11.51H86.3902C86.0016 11.51 85.7199 11.4129 85.5451 11.2186C85.3702 11.0243 85.2828 10.7134 85.2828 10.286C85.2828 9.87801 85.3702 9.58658 85.5451 9.41172C85.7394 9.23687 86.0308 9.14944 86.4194 9.14944H88.1971C88.5079 9.14944 88.8576 9.13972 89.2462 9.12029C89.6348 9.10087 90.0136 9.02315 90.3828 8.88715C90.7714 8.75115 91.0822 8.49858 91.3154 8.12944C91.5679 7.74086 91.6942 7.19686 91.6942 6.49743C91.6942 5.40943 91.4028 4.61286 90.8199 4.10772C90.2371 3.58315 89.2754 3.32086 87.9348 3.32086H81.9605V18.6209Z"
                fill="#011C46"
              />
              <path
                d="M67.2757 21.2146C65.974 21.2146 64.8083 20.9911 63.7786 20.5443C62.7683 20.078 61.9037 19.4369 61.1849 18.6209C60.4855 17.7854 59.9512 16.8043 59.582 15.6774C59.2129 14.5311 59.0283 13.2877 59.0283 11.9471V2.09686C59.0283 1.82486 59.0575 1.59172 59.1157 1.39743C59.1935 1.20314 59.3197 1.05743 59.4946 0.960288C59.6889 0.843717 59.9803 0.785431 60.3689 0.785431C60.7575 0.785431 61.0489 0.843717 61.2432 0.960288C61.4375 1.05743 61.5637 1.20314 61.622 1.39743C61.6803 1.59172 61.7095 1.83457 61.7095 2.126V11.9471C61.7095 13.2489 61.9232 14.3951 62.3506 15.386C62.778 16.3769 63.4095 17.1637 64.2449 17.7466C65.0803 18.31 66.1197 18.5917 67.3632 18.5917C68.5289 18.5917 69.5295 18.3197 70.3649 17.7757C71.2003 17.2317 71.8415 16.4643 72.2883 15.4734C72.7352 14.4826 72.9586 13.2974 72.9586 11.918V1.922C72.9586 1.68886 72.9877 1.49457 73.046 1.33915C73.1237 1.16429 73.2597 1.02829 73.454 0.931145C73.6483 0.834002 73.9397 0.785431 74.3283 0.785431C74.6975 0.785431 74.9694 0.843717 75.1443 0.960288C75.3386 1.05743 75.4649 1.20314 75.5232 1.39743C75.5814 1.59172 75.6106 1.83457 75.6106 2.126V12.0054C75.6106 13.3654 75.426 14.6089 75.0569 15.7357C74.6877 16.8431 74.1437 17.8146 73.4249 18.65C72.7254 19.466 71.8512 20.0974 70.802 20.5443C69.7723 20.9911 68.5969 21.2146 67.2757 21.2146Z"
                fill="#011C46"
              />
              <path
                d="M53.476 21.1272C53.1069 21.1272 52.8251 21.0689 52.6309 20.9523C52.456 20.8552 52.3394 20.7094 52.2811 20.5152C52.2229 20.3014 52.1937 20.0586 52.1937 19.7866V2.09686C52.1937 1.82486 52.2229 1.59172 52.2811 1.39743C52.3394 1.20315 52.4657 1.05743 52.66 0.960288C52.8543 0.843717 53.136 0.785431 53.5051 0.785431C53.8937 0.785431 54.1754 0.843717 54.3503 0.960288C54.5446 1.05743 54.6709 1.20315 54.7292 1.39743C54.7874 1.59172 54.8166 1.83458 54.8166 2.126V19.8157C54.8166 20.0877 54.7777 20.3209 54.7 20.5152C54.6417 20.7094 54.5154 20.8552 54.3211 20.9523C54.1463 21.0689 53.8646 21.1272 53.476 21.1272ZM40.3617 21.1272C39.9731 21.1272 39.6817 21.0689 39.4874 20.9523C39.3126 20.8552 39.196 20.7094 39.1377 20.5152C39.0794 20.3014 39.0503 20.0586 39.0503 19.7866V2.09686C39.0503 1.82486 39.0794 1.59172 39.1377 1.39743C39.2154 1.20315 39.3417 1.05743 39.5166 0.960288C39.7109 0.843717 40.0023 0.785431 40.3909 0.785431C40.76 0.785431 41.032 0.843717 41.2069 0.960288C41.4012 1.05743 41.5274 1.20315 41.5857 1.39743C41.644 1.59172 41.6732 1.83458 41.6732 2.126V19.8157C41.6732 20.0877 41.644 20.3209 41.5857 20.5152C41.5274 20.7094 41.4012 20.8552 41.2069 20.9523C41.0126 21.0689 40.7309 21.1272 40.3617 21.1272ZM40.4783 11.918V9.47001H52.66L52.6309 11.918H40.4783Z"
                fill="#011C46"
              />
              <path
                d="M22.2342 21.1272C21.865 21.1272 21.5833 21.0689 21.389 20.9523C21.1948 20.8552 21.0685 20.7094 21.0102 20.5152C20.9713 20.3014 20.9519 20.0586 20.9519 19.7866V2.06772C20.9519 1.81515 20.981 1.60143 21.0393 1.42658C21.117 1.23229 21.2433 1.07686 21.4182 0.960288C21.6125 0.843717 21.8942 0.785431 22.2633 0.785431H28.7039C29.6559 0.785431 30.5205 0.931145 31.2976 1.22257C32.0942 1.49457 32.7839 1.90257 33.3668 2.44657C33.9496 2.99057 34.3965 3.68029 34.7073 4.51572C35.0376 5.33172 35.2027 6.28372 35.2027 7.37172C35.2027 8.05172 35.0959 8.76086 34.8822 9.49915C34.6685 10.218 34.3382 10.898 33.8913 11.5392C33.4639 12.1803 32.9102 12.7146 32.2302 13.142C31.5502 13.5694 30.7245 13.8123 29.753 13.8706H23.5748V19.8157C23.5748 20.0877 23.5359 20.3209 23.4582 20.5152C23.3999 20.7094 23.2736 20.8552 23.0793 20.9523C22.9045 21.0689 22.6228 21.1272 22.2342 21.1272ZM34.7365 20.8066C34.3285 21.0786 33.9788 21.166 33.6873 21.0689C33.4153 20.9717 33.153 20.7386 32.9005 20.3694L28.2376 12.9089L31.1228 12.4717L35.1445 18.8832C35.3388 19.194 35.4553 19.4563 35.4942 19.67C35.5525 19.8837 35.5136 20.078 35.3776 20.2529C35.261 20.4277 35.0473 20.6123 34.7365 20.8066ZM23.5748 11.306H29.345C29.7919 11.306 30.2096 11.2283 30.5982 11.0729C30.9868 10.898 31.3268 10.6454 31.6182 10.3151C31.9096 9.98486 32.1428 9.57686 32.3176 9.09115C32.4925 8.60544 32.5799 8.02258 32.5799 7.34258C32.5799 6.50715 32.4245 5.79801 32.1136 5.21515C31.8222 4.63229 31.385 4.19515 30.8022 3.90372C30.2193 3.59286 29.5005 3.43743 28.6456 3.43743H23.5748V11.306Z"
                fill="#011C46"
              />
              <path
                d="M15.2829 21.1272C14.9138 21.1272 14.632 21.0689 14.4378 20.9523C14.2629 20.8552 14.1463 20.7094 14.088 20.5152C14.0298 20.3014 14.0006 20.0586 14.0006 19.7866V2.09686C14.0006 1.82486 14.0298 1.59172 14.088 1.39743C14.1463 1.20315 14.2726 1.05743 14.4669 0.960288C14.6612 0.843717 14.9429 0.785431 15.312 0.785431C15.7006 0.785431 15.9823 0.843717 16.1572 0.960288C16.3515 1.05743 16.4778 1.20315 16.536 1.39743C16.5943 1.59172 16.6235 1.83457 16.6235 2.126V19.8157C16.6235 20.0877 16.5846 20.3209 16.5069 20.5152C16.4486 20.7094 16.3223 20.8552 16.128 20.9523C15.9532 21.0689 15.6715 21.1272 15.2829 21.1272ZM2.16861 21.1272C1.78004 21.1272 1.48861 21.0689 1.29432 20.9523C1.11946 20.8552 1.00289 20.7094 0.944606 20.5152C0.886321 20.3014 0.857178 20.0586 0.857178 19.7866V2.09686C0.857178 1.82486 0.886321 1.59172 0.944606 1.39743C1.02232 1.20315 1.14861 1.05743 1.32346 0.960288C1.51775 0.843717 1.80918 0.785431 2.19775 0.785431C2.56689 0.785431 2.83889 0.843717 3.01375 0.960288C3.20804 1.05743 3.33432 1.20315 3.39261 1.39743C3.45089 1.59172 3.48003 1.83457 3.48003 2.126V19.8157C3.48003 20.0877 3.45089 20.3209 3.39261 20.5152C3.33432 20.7094 3.20804 20.8552 3.01375 20.9523C2.81946 21.0689 2.53775 21.1272 2.16861 21.1272ZM2.28518 11.918V9.47001H14.4669L14.4378 11.918H2.28518Z"
                fill="#011C46"
              />
            </svg>
          </div>
          <div
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 30,
              display: "flex",
            }}
          >
            {/*<div style={{height: 22, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>*/}
            {/*    <div style={{color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontFamily: 'SF Pro Text!important', fontWeight: '400',wordWrap: 'break-word'}}>Danışman Yönetimi</div>*/}
            {/*</div>*/}

            <div
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img style={{ width: 34, height: 65 }} src={SubtractLeft} />
              <div
                style={{
                  width: 200,
                  height: 65,
                  background: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: 200,
                    height: 22,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: 152,
                      height: 22,
                      color: "rgba(0, 0, 0, 0.88)",
                      fontSize: 14,
                      fontFamily: "SF Pro Text!important",
                      fontWeight: "600",
                      wordWrap: "break-word",
                      marginTop: 16,
                      marginBottom: 22,
                      marginLeft: 20.96,
                      marginRight: 7.04,
                    }}
                  >
                    Başvuru Takip Sistemi
                  </div>
                </div>
              </div>
              <img
                style={{ width: 34, height: 65, padding: 0 }}
                src={SubtractRight}
              />
            </div>

            {/*<div style={{height: 22, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>*/}
            {/*    <div style={{color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontFamily: 'SF Pro Text!important', fontWeight: '400', wordWrap: 'break-word'}}>Müşteri İlişkileri Yönetimi</div>*/}
            {/*</div>*/}

            {/*<div style={{height: 22, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>*/}
            {/*    <div style={{color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontFamily: 'SF Pro Text!important', fontWeight: '400',  wordWrap: 'break-word'}}>Bilgi Tabanı</div>*/}
            {/*</div>*/}
          </div>
        </div>

        <div
          className="profile-button"
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            display: "flex",
            borderRadius: 10,
            padding: 8,
          }}
        >
          {/*<div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', display: 'inline-flex'}}>*/}

          {/*</div>*/}
          <div
            style={{ cursor: "pointer", height: 40, display: "flex" }}
            onClick={() => navigate("/user/edit-profile")}
          >
            <div className={"flex flex-col items-end mr-[14px] "}>
              <div
                style={{
                  color: "rgba(0, 0, 0, 0.88)",
                  fontSize: 14,
                  fontFamily: "SF Pro Text!important",
                  fontWeight: "600",
                  wordWrap: "break-word",
                }}
              >
                {user.fullName}
              </div>
              <div
                style={{
                  color: "rgba(0, 0, 0, 0.88)",
                  fontSize: 12,
                  fontFamily: "SF Pro Text!important",
                  fontWeight: "400",
                  wordWrap: "break-word",
                }}
              >
                {userRole}
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                background: "#0057D9",
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: 20,
                  fontFamily: "SF Pro Text!important",
                  fontWeight: "600",
                  wordWrap: "break-word",
                }}
                className={"w-full h-full items-center justify-center flex"}
              >
                <span>{user.fullName[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*NAVBAR*/}

      <div className="w-[1440px] h-16 px-6 bg-white justify-start items-start gap-2 inline-flex nav">
        {/*<div className=" cursor-pointer dashboard-button w-[115px] px-3 pt-[12px] pb-[12px] rounded-lg justify-center items-center gap-2 flex">*/}
        {/*    /!*<div className="w-[63px] text-center text-black text-opacity-90 text-sm font-normal font-['SF Pro Text'] leading-snug">Submenu</div>*!/*/}
        {/*    <button className={` w-auto h-[22px] X text-center text-black ${isHovered ? "bg-gray-200" : ""} text-opacity-90 text-sm font-normal font-['SF Pro Text'] leading-snug`} onClick={()=>navigate("/user/dashboard")} >Dashboard</button>*/}
        {/*    /!*<div className="w-3 h-3 relative -ml-1" /> <CaretDownOutlined/>*!/*/}
        {/*</div>*/}

        <div
          className={` dashboard-button cursor-pointer w-[auto] h-10 px-3 rounded-lg justify-center items-center  gap-2 inline-flex`}
        >
          {/*<div className=" w-[63px] text-center text-black text-opacity-90 text-sm font-normal font-['SF Pro Text'] leading-snug">Dashboard</div>*/}
          <NavLink
            to={"/user/dashboard"}
            style={{ textDecoration: "none", color: "black" }}
          >
            Dashboard
          </NavLink>
        </div>

        {/*  <Dropdown*/}
        {/*  className={`flex h-10 px-3 items-center gap-2 rounded-lg `}*/}
        {/*  overlay={*/}
        {/*    <Menu>*/}
        {/*      {itemsHr.map((item) => {*/}
        {/*        if (item.type === "divider") {*/}
        {/*          return <Menu.Divider />;*/}
        {/*        } else {*/}
        {/*          return (*/}
        {/*            <Menu.Item*/}
        {/*              onClick={() => {*/}
        {/*                setIsHrsOpen(false);*/}
        {/*              }}*/}
        {/*                  key={item.key}*/}
        {/*            >*/}

        {/*              {item.label}*/}
        {/*            </Menu.Item>*/}

        {/*          );*/}
        {/*        }*/}
        {/*      })}*/}
        {/*    </Menu>*/}
        {/*  }*/}
        {/*  trigger={["hover"]}*/}
        {/*  onVisibleChange={(visible) => {*/}
        {/*    setIsHrsOpen(visible);*/}
        {/*  }}*/}
        {/*  placement="bottomLeft"*/}
        {/*>*/}
        {/*  <NavLink className="dropdown-navlink">*/}
        {/*    <Space className="w-[115px] h-[40px] rounded-lg justify-center">*/}
        {/*      HR*/}
        {/*      <span style={{marginLeft:8}}>{isHrOpen ? <CaretUpOutlined className={"caretArrow"}/> : <CaretDownOutlined className={"caretArrow"}/>}</span>*/}
        {/*    </Space>*/}
        {/*  </NavLink>*/}
        {/*</Dropdown>*/}

        <Dropdown
          className={`flex h-10 px-3 items-center  rounded-lg `}
          overlay={
            <Menu>
              {itemsPosition.map((item) => {
                if (item.type === "divider") {
                  return <Menu.Divider />;
                } else {
                  return (
                    // <ConfigProvider>
                    <Menu.Item
                      onClick={() => {
                        setIsPositionOpen(false);
                      }}
                      key={item.key}
                    >
                      {item.label}
                    </Menu.Item>
                    // </ConfigProvider>
                  );
                }
              })}
            </Menu>
          }
          trigger={["hover"]}
          onVisibleChange={(visible) => {
            setIsPositionOpen(visible);
          }}
          placement="bottomLeft"
        >
          <NavLink className="dropdown-navlink">
            <Space>
              Position
              <span className="ml-2">
                {isPositionOpen ? (
                  <CaretUpOutlined className={"caretArrow"} />
                ) : (
                  <CaretDownOutlined className={"caretArrow"} />
                )}
              </span>
            </Space>
          </NavLink>
        </Dropdown>

        <Dropdown
          className={`flex h-10 px-3 items-center gap-2 rounded-lg `}
          overlay={
            <Menu>
              {itemsCandidate.map((item) => {
                if (item.type === "divider") {
                  return <Menu.Divider key={item.key} style={{ margin: 0 }} />;
                } else {
                  return (
                    <Menu.Item
                      onClick={() => {
                        setIsCandidateOpen(false);
                      }}
                      key={item.key}
                    >
                      {item.label}
                    </Menu.Item>
                  );
                }
              })}
            </Menu>
          }
          trigger={["hover"]}
          onVisibleChange={(visible) => {
            setIsCandidateOpen(visible);
          }}
          placement="bottomLeft"
        >
          <NavLink className="dropdown-navlink">
            <Space>
              Candidate
              <span className="ml-2">
                {isCandidateOpen ? (
                  <CaretUpOutlined className={"caretArrow"} />
                ) : (
                  <CaretDownOutlined className={"caretArrow"} />
                )}
              </span>
            </Space>
          </NavLink>
        </Dropdown>

        <Dropdown
          className={`flex h-10 px-3 items-center gap-2 rounded-lg `}
          overlay={
            <Menu>
              {itemsApplicant.map((item) => {
                if (item.type === "divider") {
                  return <Menu.Divider />;
                } else {
                  return (
                    <Menu.Item
                      onClick={() => {
                        setIsApplicantOpen(false);
                      }}
                      key={item.key}
                    >
                      {item.label}
                    </Menu.Item>
                  );
                }
              })}
            </Menu>
          }
          trigger={["hover"]}
          onVisibleChange={(visible) => {
            setIsApplicantOpen(visible);
          }}
          placement="bottomLeft"
        >
          <NavLink className="dropdown-navlink">
            <Space>
              Applicant
              <span className="ml-2">
                {isApplicantOpen ? (
                  <CaretUpOutlined className={"caretArrow"} />
                ) : (
                  <CaretDownOutlined className={"caretArrow"} />
                )}
              </span>
            </Space>
          </NavLink>
        </Dropdown>

        <Dropdown
          className={`flex h-10 px-3 items-center gap-2 rounded-lg `}
          overlay={
            <Menu>
              {itemsPool.map((item) => {
                if (item.type === "divider") {
                  return <Menu.Divider />;
                } else {
                  return (
                    <Menu.Item
                      onClick={() => {
                        setIsPoolsOpen(false);
                      }}
                      key={item.key}
                    >
                      {item.label}
                    </Menu.Item>
                  );
                }
              })}
            </Menu>
          }
          trigger={["hover"]}
          onVisibleChange={(visible) => {
            setIsPoolsOpen(visible);
          }}
          placement="bottomLeft"
        >
          <NavLink className="dropdown-navlink">
            <Space>
              Pool
              <span className="ml-2">
                {isPoolsOpen ? (
                  <CaretUpOutlined className={"caretArrow"} />
                ) : (
                  <CaretDownOutlined className={"caretArrow"} />
                )}
              </span>
            </Space>

            {/*<span className="w-[115px] h-[40px] rounded-lg justify-center">*/}
            {/*  Pool*/}
            {/*  <span className="ml-2">*/}
            {/*  {isPoolsOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}*/}
            {/*  </span>*/}

            {/*</span>*/}
          </NavLink>
        </Dropdown>
        <div
          className={` dashboard-button cursor-pointer w-[auto] h-10 px-3 rounded-lg justify-center items-center  gap-2 inline-flex`}
        >
          {/*<div className=" w-[63px] text-center text-black text-opacity-90 text-sm font-normal font-['SF Pro Text'] leading-snug">Dashboard</div>*/}
          <NavLink
            to={"/login"}
            onClick={()=>logOut()}
            style={{ textDecoration: "none", color: "black" }}
          >
            Logout
          </NavLink>
        </div>
      </div>
    </div>
  );
}
