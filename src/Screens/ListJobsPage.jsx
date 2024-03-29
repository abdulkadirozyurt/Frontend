import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Space, Typography, Table, Menu, Checkbox, Tag, ConfigProvider } from 'antd';
import { SearchOutlined, CaretDownOutlined, CaretUpOutlined, PlusOutlined } from '@ant-design/icons';
import axios from "axios";
import "../ListJobsPage.css"

const filters = [
  { key: 'filter1', label: 'Location' },
  { key: 'filter2', label: 'Status' },
  { key: 'filter3', label: 'WorkType' },
  { key: 'filter4', label: 'EmploymentType' },
];

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [dropdownStates, setDropdownStates] = useState(filters.map(() => false));
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortConditions, setSortConditions] = useState([])
  const [filteringConditions, setFilteringConditions] = useState()
  const [filteringColumns, setFilteringColumns] = useState([])
  const [totalPage, setTotalPage] = useState()
  const [totalJobCount, setTotalJobCount] = useState()
  const [filterOptions, setFilterOptions] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([
    { columnName: "location", filterFields: [] },
    { columnName: "status", filterFields: [] },
    { columnName: "workType", filterFields: [] },
    { columnName: "employmentType", filterFields: [] },
  ]);

  const onPageChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  const fetchJobs = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement/list`, { filteringConditions: filteringConditions, searchText: searchText, sortConditions: sortConditions, pageSize: 5, pageNumber: pageNumber });
      const jobsArray = response.data.jobAdvertisements || [];
      setJobs(jobsArray);
      setTotalPage(response.data.totalPages)
      setTotalJobCount(response.data.totalCount)
    } catch (error) {
      console.error(error)
    }
  };
  const fetchFilterOptions = async () => {
    try {
      let columns = []
      columns.push("location")
      columns.push("status")
      columns.push("workType")
      columns.push("employmentType")
      setFilteringColumns(columns)
      const response = await axios.post(`${process.env.REACT_APP_PORT}/job/jobAdvertisement/filter`, { columnName: filteringColumns });
      const filterOptions = response.data.filterOptions || [];
      setFilterOptions(filterOptions)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PORT}/candidate/candidate/list`,
      );

      const candidatesArray = response.data.candidates || [];
      setCandidates(candidatesArray);
    } catch (error) { }
  };
  const handleScroll = () => {
    const scrollTop = contentRef.current.scrollTop;
    const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
    const percentage = (scrollTop / scrollHeight) * 100;
    setScrollPercentage(percentage);
  };
  const handleVisibleChange = (index, visible) => {
    fetchFilterOptions();
    const newDropdownStates = [...dropdownStates];
    newDropdownStates[index] = visible;
    setDropdownStates(newDropdownStates);
  };

  const handleChange = (pagination, filters, sorter) => {
    if (sorter.order) {

      let conditionsSort = []
      conditionsSort[0] = {
        columnName: sorter.field,
        sortOrder: sorter.order == "descend" ? -1 : 1
      }
      setSortConditions(conditionsSort)
    } else {
      setSortConditions([])
    }
    setSortedInfo(sorter);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleButtonClick = () => {
    console.log("butona bastın");
  }

  const handleSearch = (event) => {
    setSearchText(event.target.value)
  };

  const formatDateTime = (deadline) => {
    const applicationDeadline = new Date(deadline);
    const formattedDeadline = applicationDeadline.toLocaleDateString() + " " + applicationDeadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return formattedDeadline;
  }

  const groupedOptions = {};
  filterOptions.forEach(option => {
    if (!groupedOptions[option.columName]) {
      groupedOptions[option.columName] = [];
    }
    groupedOptions[option.columName] = groupedOptions[option.columName].concat(option.distinctValues.map((value, index) => ({
      key: `${option.columName}_${index}`,
      label: value.toString()
    })));
  });

  const transformedData = {};

  filterOptions.forEach(option => {
    transformedData[option.columName] = option.distinctValues;
  });

  console.log("transform::", transformedData);
  const columns = [
    {
      title: 'Position Name',
      dataIndex: 'positionName',
      key: 'positionName',
      sorter: true
    },
    {
      title: 'Company',
      dataIndex: 'company',
      sorter: true,
    },
    {
      title: 'Quota',
      dataIndex: 'quota',
      sorter: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Application Deadline',
      dataIndex: formatDateTime(jobs.applicationDeadline),
      sorter: true,
      render: (text, record) => formatDateTime(record.applicationDeadline)
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <>
          {status === false ? (
            <Tag color='red' key={status}>
              Close
            </Tag>
          ) : (
            <Tag color='green' key={status}>
              Open
            </Tag>
          )}
        </>
      ),
    },
    {
      title: 'Work Type',
      dataIndex: 'workType',
    },
    {
      title: 'Employment Type',
      dataIndex: 'employmentType',
    },
  ];

  const handleFilterChange = (option, optionType) => {
    const filterIndex = selectedFilters.findIndex(filter => filter.columnName === optionType);

    if (filterIndex !== -1) {
      const updatedFilters = [...selectedFilters];
      const optionIndex = updatedFilters[filterIndex].filterFields.indexOf(option);
      if (optionIndex !== -1) {
        updatedFilters[filterIndex].filterFields.splice(optionIndex, 1);
      } else {
        updatedFilters[filterIndex].filterFields.push(option);
      }
      setSelectedFilters(updatedFilters);
      // Tüm filterFields alanlarının boş olup olmadığını kontrol et
      const allFilterFieldsEmpty = updatedFilters.every(item => item.filterFields.length === 0);

      // Eğer tüm filterFields alanları boşsa, filteringConditions'ı null olarak ayarla
      if (allFilterFieldsEmpty) {
        setFilteringConditions(null);
      } else {
        // Değilse, güncellenmiş filtreleri ayarla
       // setFilteringConditions(updatedFilters);
        const nonEmptyFilters = updatedFilters.filter(item => item.filterFields.length > 0);
        setFilteringConditions(nonEmptyFilters);
      }
      console.log("xd", updatedFilters)
    }
  }

  const renderCheckbox = (option, optionType) => {
    const selectedFilter = selectedFilters.find(filter => filter.columnName === optionType);
    const selectedOptions = selectedFilter ? selectedFilter.filterFields : [];
    const isChecked = selectedOptions.includes(option);

    return (
      <Checkbox checked={isChecked} onClick={() => handleFilterChange(option, optionType)}>
        <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex', padding: '8px 0' }}>
          <div style={{ color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontWeight: '400', wordWrap: 'break-word' }}>
            {typeof option === 'boolean' ? (
              option ? (
                <Tag color='green' key={option}>
                  Open
                </Tag>
              ) : (
                <Tag color='red' key={option}>
                  Close
                </Tag>
              )
            ) : (
              option
            )}
          </div>
        </div>
      </Checkbox>
    );
  }

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
    fetchFilterOptions();
  }, [searchText, pageSize, pageNumber, sortConditions,filteringConditions]);

  const DropdownMenu = ({ filter }) => (
    <Menu>
      <div className="scrollbar-custom">
        <div
          className="scrollbar-content"
          ref={contentRef}
          onScroll={handleScroll}
        >
          {Object.keys(transformedData).map((optionType) => {
            return (
              transformedData[optionType] && transformedData[optionType].length > 0 && optionType.toLowerCase() === filter.label.toLowerCase() ? (
                transformedData[optionType].map((option, index) => (

                  <Menu.Item key={`${filter.key}_${index}`} style={{ padding: 0 }}>
                    <div style={{ width: '100%', paddingLeft: 24, paddingRight: 24, borderRadius: 4 }}>
                      {renderCheckbox(option, optionType)}
                    </div>
                  </Menu.Item>
                ))
              ) : (
                console.log("bbbbbbbbbbbb")
              )
            );
          })}
        </div>
        <div className="scrollbar-scrollbar">
          <div
            className="scrollbar-slider"
            style={{ height: `${scrollPercentage}%` }}
          ></div>
        </div>
      </div>
    </Menu>
  );

  return (
    <div style={{ background: '#F9F9F9' }}>
      <div style={{ padding: '24px' }}>
        <div style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
          <div style={{ width: '218', height: '54', justifyContent: 'flex-start', alignItems: 'center', gap: 36, display: 'inline-flex' }}>
            <div style={{ background: 'white' }}>
              <div className="custom-search-bar" style={{ marginLeft: 16, paddingTop: 16, paddingBottom: 16, marginRight: 16 }}>
                <input placeholder="Search" onChange={handleSearch} style={{ width: '166', border: 'none' }} />
                <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {filterOptions && filters.map((filter, index) => (
                <Dropdown
                  key={filter.key}
                  overlay={<DropdownMenu filter={filter} />}
                  trigger={['click']}
                  onVisibleChange={(visible) => handleVisibleChange(index, visible)}
                  visible={dropdownStates[index]}
                >
                  <Typography.Link>
                    <Space style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4 }}>
                      <div style={{ color: '#0057D9', fontSize: 14, fontWeight: '400', wordWrap: 'break-word' }}>{filter.label}</div>
                      <div>
                        <div style={{ position: 'relative' }}>
                          {dropdownStates[index] ? <CaretUpOutlined /> : <CaretDownOutlined />}
                        </div>
                      </div>
                    </Space>
                  </Typography.Link>
                </Dropdown>
              ))}
            </div>
          </div>
          {/* <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
            <Button style={{ width: 143, height: 40, paddingLeft: 16, paddingRight: 16, boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.02)', borderRadius: 8, border: '1px rgba(0, 0, 0, 0.15) solid', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex', cursor: 'pointer' }} onClick={handleButtonClick}>
              <div style={{ justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.88)', fontSize: 16, fontWeight: '400', wordWrap: 'break-word' }}>Button Text</div>
              </div>
            </Button>
            <Button style={{ width: 143, height: 40, paddingLeft: 16, paddingRight: 16, background: '#0057D9', boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.02)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex', cursor: 'pointer' }} onClick={handleButtonClick}>
              <div style={{ justifyContent: 'center', alignItems: 'center', gap: 8, display: 'flex' }}>
                <PlusOutlined style={{ color: 'white' }} />
                <div style={{ color: 'white', fontSize: 16, fontWeight: '400', wordWrap: 'break-word' }}>Button Text</div>
              </div>
            </Button>
          </div> */}
        </div>

        <div style={{ marginTop: 24, marginBottom: 12, width: '100%', height: '100%' }}>
          <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'inline-flex' }}>
            <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex' }}>
              <div style={{ width: 236.80, height: 28, color: 'rgba(0, 0, 0, 0.88)', fontSize: 20, fontWeight: '600', wordWrap: 'break-word' }}>Job Advertisement List</div>
            </div>
            <div style={{ width: 236.80, height: 22, color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontWeight: '400', wordWrap: 'break-word' }}>Total {totalJobCount} results are displayed</div>
          </div>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "rgba(0, 0, 0, 0.06)",
              },
            },
          }}
        >
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={jobs}
            onChange={handleChange}
            pagination={{
              showQuickJumper: true,
              defaultCurrent: 1,
              total: totalPage * 10,
              onChange: onPageChange,
              showSizeChanger: false
            }}
            className="custom-table"
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default App;