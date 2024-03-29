import React, { useRef, useState } from 'react';
import { Button, Dropdown, Space, Typography, Table, Menu, Checkbox } from 'antd';
import { SearchOutlined, CaretDownOutlined, CaretUpOutlined, PlusOutlined  } from '@ant-design/icons';
import "../ListJobsPage.css"

const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
];

const onPageChange = (pageNumber) => {
    console.log('Page: ', pageNumber);
};

const items = [
  {
    key: '1',
    label: 'Filter Item 1',
  },
  {
    key: '2',
    label: 'Filter Item 2',
  },
  {
    key: '3',
    label: 'Filter Item 3',
  },
  {
    key: '4',
    label: 'Filter Item 1',
  },
  {
    key: '5',
    label: 'Filter Item 2',
  },
  {
    key: '6',
    label: 'Filter Item 3',
  },
  {
    key: '7',
    label: 'Filter Item 1',
  },
  {
    key: '8',
    label: 'Filter Item 2',
  },
  {
    key: '9',
    label: 'Filter Item 3',
  },
];

const filters = [
  { key: 'filter1', label: 'Filter A' },
  { key: 'filter2', label: 'Filter B' },
  { key: 'filter3', label: 'Filter C' },
  { key: 'filter4', label: 'Filter D' },
];

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [dropdownStates, setDropdownStates] = useState(filters.map(() => false));
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const contentRef = useRef(null);

  const handleScroll = () => {
    const scrollTop = contentRef.current.scrollTop;
    const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
    const percentage = (scrollTop / scrollHeight) * 100;
    setScrollPercentage(percentage);
  };
  const handleVisibleChange = (index, visible) => {
    const newDropdownStates = [...dropdownStates];
    newDropdownStates[index] = visible;
    setDropdownStates(newDropdownStates);
  };

  const handleChange = (sorter) => {
    console.log('Various parameters', sorter);
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

  const columns = [
    {
      title: 'Position Name',
      dataIndex: 'name',
      width: '20%',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'axxx',
      dataIndex: 'axxx',
    }
  ];
  const DropdownMenu = ({ items }) => (
    <Menu>
      <div className="scrollbar-custom">
        <div
          className="scrollbar-content"
          ref={contentRef}
          onScroll={handleScroll}
        >
          {items.map(item => (
            <Menu.Item key={item.key} style={{ padding: 0 }}>
              <div style={{ width: '100%', paddingLeft: 24, paddingRight: 24, borderRadius: 4 }}>
                <Checkbox>
                  <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex', padding: '8px 0'}}>
                    <div style={{ color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontWeight: '400', wordWrap: 'break-word' }}>{item.label}</div>
                  </div>
                </Checkbox>
              </div>
            </Menu.Item>
          ))}
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
    <div>
      <div style={{ padding: '24px' ,background: '#F9F9F9'}}>
        <div style={{ width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
          <div style={{ width: '218', height: '54',  justifyContent: 'flex-start', alignItems: 'center', gap: 36, display: 'inline-flex' }}>
            <div style = {{ background: 'white' }}>
              <div className="custom-search-bar" style={{ marginLeft: 16, paddingTop: 16, paddingBottom: 16,marginRight: 16 }}>
                <input placeholder="Search" style={{ width: '166', border: 'none' }}/>
                <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {filters.map((filter, index) => (
                <Dropdown
                  key={filter.key}
                  overlay={<DropdownMenu items={items} />}
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
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
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
          </div>
        </div>
        
        <div style={{ marginTop:24, marginBottom: 12, width: '100%', height: '100%' }}>
          <div style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'inline-flex'}}>
            <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 4, display: 'inline-flex'}}>
              <div style={{width: 236.80, height: 28, color: 'rgba(0, 0, 0, 0.88)', fontSize: 20, fontWeight: '600', wordWrap: 'break-word'}}>This is a title</div>
            </div>
            <div style={{width: 236.80, height: 22, color: 'rgba(0, 0, 0, 0.88)', fontSize: 14, fontWeight: '400', wordWrap: 'break-word'}}>Total 128 results are displayed</div>
          </div>
        </div>

        <Table   
            rowSelection={rowSelection} 
            columns={columns} 
            dataSource={data} 
            onChange={handleChange} 
            pagination={{ 
                showQuickJumper: true, 
                defaultCurrent: 1, 
                total: 500, 
                onChange: onPageChange, 
                showSizeChanger: false
              }}  
            className="custom-table"
        />
      </div>
    </div>    
  );
};

export default App;