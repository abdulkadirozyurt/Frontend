import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Label,
  Input,
  Button,
} from "@material-tailwind/react";
import { FormGroup, Col } from "reactstrap";
import { PencilIcon, TrashIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { React,useState,useEffect } from "react";
import axios from 'axios'
import CreatePoolModal from "./CreatePoolModal.jsx"
import AddCandidateToPoolModal from "./AddCandidateToPoolModal.jsx"

export default function ListPool(){


  const [isDetailPageActive,setIsDetailPageActive] =useState(false)
  const [poolDetail,setPoolDetail] = useState([])
  const [pools,setPools] = useState([])
  const [ShowCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [showAddCandidateModal, setShowCandidatePoolModal] = useState(false);
  const [search, setSearch] = useState("");
  const [poolName, setPoolName] = useState("");
  const [currentpoolId, setCurrentPoolId] = useState("");
  const [pageNumber,setPageNumber] = useState("");
  const [pageSize,setPageSize] = useState("");
  const [searchText,setSearchText] = useState("");
  const [sortConditions,setSortConditions] = useState()

  const createPoolModal = () => {
      setShowCreatePoolModal(true);
    };

    const handleCloseModal = () => {
      setShowCreatePoolModal(false);
    };

  const openAddCandidateModal = () => setShowCandidatePoolModal(true);
  const closeAddCandidateModal = () => {
    window.location.reload()
    poolDetails(currentpoolId)
    setShowCandidatePoolModal(false);
  }
    


const poolDetails = async(poolId)=>{
 
  setIsDetailPageActive(true)

  await axios
  .post(`${process.env.REACT_APP_PORT}/talentpool/talentPool/id`,{poolId:poolId})
  .then((response) => {
  
  setPoolDetail(response.data.arrTalentPool)
  setCurrentPoolId(poolId)
  });

}
const deletePool = async(poolId)=>{
 

await axios
.delete(`${process.env.REACT_APP_PORT}/talentpool/talentPool`,{data:{poolId:poolId}})
.then((response) => {

});

window.location.reload()

}
const removeCandidateFromPool = async(candidateId,poolId)=>{

await axios
.delete(`${process.env.REACT_APP_PORT}/talentpool/talentPoolDeleteCandidate`,{data:{poolId:poolId,candidateId:candidateId}})
.then((response) => {

});

poolDetails(poolId)


}
const updatePoolName = async () => {

await axios
.put(`${process.env.REACT_APP_PORT}/talentpool/talentPool`, { poolId: currentpoolId, poolName: poolName })
  .then((response) => {
    const updatedPoolDetails = poolDetail.map(pool => {
      if (pool.poolId === currentpoolId) {
        return {
          ...pool,
          poolName: poolName
        };
      } else {
        return pool;
      }
    });
    setPoolDetail(updatedPoolDetails)
  });

  window.location.reload()
}

const getPools = async ()=>{  
  // console.log(searchText)

  // const newSortCondition = {
  //   columnName: 'poolName',
  //   sortOrder: 1
  // }
  
  
  // let existingSortConditions=[]
  // existingSortConditions.push(newSortCondition)
  // console.log(existingSortConditions)
  // setSortConditions(existingSortConditions)

  // console.log(sortConditions)
  // setPageNumber(1);
  // setPageSize(1)
  // console.log("a",pageSize,pageNumber)
  await axios
  .post(`${process.env.REACT_APP_PORT}/talentpool/talentPool/list`,{searchText:searchText,sortConditions:sortConditions,pageSize:pageSize,pageNumber:pageNumber})
  .then((response) => {
    if(response.data.success){
      setPools(response.data.arrTalentPool)
    }
  })
}

let filteredPools = pools.filter((pool => {

  return (
    pool.poolName && pool.poolName.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
  )

}))



const searchPool = (event) => {
  setSearchText(event.target.value)

//setSearch(event.target.value)
};

useEffect(() => {
 getPools()
}, [searchText,pageNumber,pageSize]);



  return(
     
      <>
     
  <Col>

      <Col >
      <div className="mr-6 ml-6 mt-10 mb-8 flex items-center justify-between gap-8">
        <div>
          <Typography variant="h5" color="blue-gray">
            Candidate pools
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            See information about all candidate pools
          </Typography>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
        
          {/* <Button className="flex items-center gap-3" size="sm"  onClick={() => createPoolModal()}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add new Pool
          </Button> */}
        </div>
      </div>
      <div className=" ml-6 mr-6 flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
        <div className="w-full md:w-72">
       
          <Input
            label="Search"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            onChange={searchPool}
          />
    
        </div>
      </div>
      
    </Col>

   
    <div className="flex">
  <Col >
  <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
  {filteredPools && filteredPools.map(pool => (
      <Col key={pool.poolId}>
          <Card className="mb-3 shadow-md ml-6 mr-6 w-full max-w-[48rem] flex-row items-center">
              <CardHeader
                  shadow={false}
                  floated={false}
                  className="m-0 shrink-0 rounded-r-none"
              />
              <CardBody>
                  <div className="flex items-center justify-between mb-2">
                      <Typography variant="h4" color="blue-gray" className="mb-0">
                          {pool.poolName}
                      </Typography>
                      <a href="#" className="inline-block flex">
                          <Button variant="text" className="flex items-center gap-2" onClick={() => poolDetails(pool.poolId)}>
                              İNCELE
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  className="h-4 w-4"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                  />
                              </svg>
                          </Button>
                          <Button variant="text" className="flex items-center gap-2" onClick={() => deletePool(pool.poolId)}>
                              SİL
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  className="h-4 w-4"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                  />
                              </svg>
                          </Button>
                      </a>
                  </div>
              </CardBody>
          </Card>
      </Col>
  ))}
</div>
  </Col>

  <Col>
  {isDetailPageActive && 
  
    <Col>
         <Card className="bg-blue-gray-200 ml-6 mr-6 h-[75vh] w-full max-w-[48rem] flex-col ">

              <div  className="rounded-md h-12 px-4 py-2  text-white">
                
              <Input
            id="poolName"
            defaultValue={poolDetail && poolDetail[0] && poolDetail[0].poolName} 
            name="poolName"
            type="text"
            style={{ fontSize: '20px' }} // Metin boyutunu 18px olarak ayarla
            onChange={(event) => setPoolName(event.target.value)}
            onFocus={() => setCurrentPoolId(poolDetail && poolDetail[0] && poolDetail[0].poolId)} 
            onBlur={updatePoolName}
          />

        
                </div>
                <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>İsim Soyisim</th>
                      <th>Mail adresi</th>
                      <th>Telefon</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poolDetail && poolDetail[0] && poolDetail[0].candidates && poolDetail[0].candidates.map((candidate) => (
                      <tr key={candidate.candidateId}>
                        <td>{candidate.candidateName}</td>
                        <td>{candidate.candidateEmail}</td>
                        <td>{candidate.candidatePhoneCode}{candidate.candidatePhone}</td>
                        <td>
                          <button className="delete-btn" onClick={()=>removeCandidateFromPool(candidate.candidateId,poolDetail && poolDetail[0] && poolDetail[0].poolId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
           <Button className="flex w-32  gap-3  mt-24 ml-72" size="sm"  onClick={() => openAddCandidateModal()}>
            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Ekle
          </Button>


          </Card>
      </Col>
}


 





{ShowCreatePoolModal && (
      <CreatePoolModal
        onClose={handleCloseModal}
      />
  )}
  {showAddCandidateModal && (
      <AddCandidateToPoolModal
       poolId={currentpoolId}
       poolDetails={poolDetails}
        onClose={closeAddCandidateModal}
      />
  )}
  </Col>

</div>



  </Col>
      </>
      
  );
 
  }