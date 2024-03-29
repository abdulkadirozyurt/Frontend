import axios from "axios";
import { authenticateUser } from '../../../Backend/src/routes/authRouter.js'

const instance = axios.create({
  // baseURL: "http://64.225.103.36/", 
   baseURL: `${process.env.REACT_APP_PORT}/`,
});

instance.interceptors.request.use((config) => {
  //   const auth = localStorage.getItem("auth");
  //   if (!auth) return config;
  //   const parsed = JSON.parse(auth);
  //   config.headers["x-access-token"] = parsed?.token;
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status && error.response) {

      //localStorage.clear();
      window.location.href = "/";
    } else {
      return Promise.reject(error);
    }
  }
);

// eslint-disable-next-line
export default {
  user: {
    async login(email, password) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/user/login`, { email, password }); //http://64.225.103.36:5001/user/login
      return response.data;
    },
    async refreshAccessToken(accessToken, refreshToken) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/user/refreshAccessToken`, { accessToken, refreshToken });
      return response.data;
    },
    async register(companyName, email, password, passwordConfirmation, phone, fullName) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/user/register`, { companyName, email, password, passwordConfirmation, phone, fullName });
      return response.data;
    },
    async hrRegister(token, email, password, passwordConfirmation, phone, fullName) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/user/hrRegister`, { token, email, password, passwordConfirmation, phone, fullName });
      return response.data;
    },
    async sendMail( email, password,fullName) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/user/sendMail`, {  email, password,fullName });
      return response.data;
    },
    async listUsers() {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/user/listUsers`);
      return response.data;
    },
    async getUserById(token) {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/user/getUser/id`, {token}); 
      return response.data;
    },

    async resetPassword(id,password,token) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/user/resetPassword`, {id,password,token}); 
      return response.data;
    },

    // async updateUser( email, newEmail, password, phone, fullName) {
    //   const response = await instance.put(`${process.env.REACT_APP_PORT}/user/updateUser`, { email, newEmail, password, phone, fullName }); 
    //   return response.data;
    // },

    async updateUser(  password, phone, phoneCode) {
      const response = await instance.put(`${process.env.REACT_APP_PORT}/user/updateUser`, { password, phone, phoneCode }); 
      return response.data;
    },

    async deleteUser(email) {
      const response = await instance.delete(`${process.env.REACT_APP_PORT}/user/deleteUser`, { email }); 
      return response.data;
    },
  
  },
  candidate:{
    async listCandidate() {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/candidate/candidate`); 
      return response.data;
    },
    async getCandidateByEmail(email) {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/candidate/candidate/email`, {email}); 
      return response.data;
    },
    async addCandidate(fullName,email,phone,socials,location,workType,workModel,technicalSkills,salaryExpectation,languageSkills,militaryServiceStatus,cv) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/candidate/candidate`, {fullName,email,phone,socials,location,workType,workModel,technicalSkills,salaryExpectation,languageSkills,militaryServiceStatus,cv}); 
      return response.data;
    },
    async deleteCandidate(email) {
      const response = await instance.delete(`${process.env.REACT_APP_PORT}/candidate/candidate`, {email}); 
      return response.data;
    },
    async updateCandidate(fullName,email,newEmail,phone,socials,location,workType,workModel,technicalSkills,salaryExpectation,languageSkills,militaryServiceStatus) {
      const response = await instance.put(`${process.env.REACT_APP_PORT}/candidate/candidate`, {fullName,email,newEmail,phone,socials,location,workType,workModel,technicalSkills,salaryExpectation,languageSkills,militaryServiceStatus}); 
      return response.data;
    },
  },
  jobAdvertisement:{
    async listJobAdvertisement() {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`); 
      return response.data;
    },
    async getJobAdvertisementById(jobId) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement/id`, {jobId}); 
      return response.data;
    },
    async addJobAdvertisement( company, positionName, location, jobDescription, qualifications, applicationDeadline, employmentType,workType, postedAt,token ) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`, { company, positionName, location, jobDescription, qualifications, applicationDeadline, employmentType,workType, postedAt ,token}); 
      return response.data;
    },
    async deleteJobAdvertisement(jobId) {
      const response = await instance.delete(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`, {jobId}); 
      return response.data;
    },
    async updateJobAdvertisement(jobId, company, positionName, location, jobDescription, qualifications, applicationDeadline, employmentType,workType, postedAt) {
      const response = await instance.put(`${process.env.REACT_APP_PORT}/job/jobAdvertisement`, {jobId, company, positionName, location, jobDescription, qualifications, applicationDeadline, employmentType,workType, postedAt}); 
      return response.data;
    },
  },
  auth: {
    async authenticateUser(token) {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/auth/auth`, {token});
      return response.data;
    },
  },
  talentPool:{
    async getTalentPools() {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/talentpool/talentPool`); 
      return response.data;
    },
    async getTalentPoolById(poolId) {
      const response = await instance.get(`${process.env.REACT_APP_PORT}/talentpool/talentPool/id`, {poolId}); 
      return response.data;
    },
    async createTalentPool( poolName, candidates ) {
      const response = await instance.post(`${process.env.REACT_APP_PORT}/talentpool/talentPool`, { poolName, candidates }); 
      return response.data;
    },
    async deleteTalentPool(poolId) {
      const response = await instance.delete(`${process.env.REACT_APP_PORT}/talentpool/talentPool`, {poolId}); 
      return response.data;
    },
    async updateTalentPool( poolId, poolName ) {
      const response = await instance.put(`${process.env.REACT_APP_PORT}/talentpool/talentPool`, { poolId, poolName }); 
      return response.data;
    },
  },  
}