import React, { useState, useEffect } from 'react';
import { 
    PageHeader, 
    Table,
    Input,
    Space,
    Button,
    Switch
} from 'antd';
import { 
    SearchOutlined
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import request from '../utils/apisauce';
import checkjob from '../utils/checkjob';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";

function UserListPage() {
    const [data, setData] = useState(null);
    const jobCategory = checkjob(["Admin"]) ? "$JobCategory=('Manager','Nurse','PTNurse')" : "$JobCategory=('Nurse','PTNurse')";

    useEffect(() => {
        const action = async function() {
            var response = await request("GET", "User?$Now=true");
            if(response.Ok) {
                response = await request("GET", `User?$Now=true&limit=${response.Result.meta.total ? response.Result.meta.total : 10}&${jobCategory}`);
                response.Result.result.forEach((element,index) => {
                    element.key = index + 1;
                });
                setData(response.Result.result);
            }
        };
        action();
    },[jobCategory]);

    const getData = async(now) => {
        var response = await request("GET", `User?$Now=${now}`);
            if(response.Ok) {
                response = await request("GET", `User?$Now=${now}&limit=${response.Result.meta.total ? response.Result.meta.total : 10}&${jobCategory}`);
                response.Result.result.forEach((element,index) => {
                element.key = index + 1;
            });
            setData(response.Result.result);
        }
    }

    const pageHeader = () => {
        return (
          <PageHeader
            title="User List"
            style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
            extra={[
                <Switch 
                    key="1"
                    checkedChildren="NOW" 
                    unCheckedChildren="ALL"
                    defaultChecked={true}
                    onClick={(e) => {
                        getData(e);
                    }} 
                />,
                <Button key="2" type="primary">
                    <Link to="/useradd">Add User</Link>
                </Button>,
            ]} 
          />
        );
    }

    // filter and sort shit
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [searchedColumn, setSearchedColumn] = useState(null);
    const [searchInput, setSearchInput] = useState(null);

    //pagination, filters, sorter
    const handleChange = (filters) => {
        setFilteredInfo(filters);
        //setSortedInfo(sorter);
    };
    // end of filter and sort shit

    // search shit
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
                ref={node => {
                    setSearchInput(node);
                }}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput ? setSearchInput(searchInput.select()) : null);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };
    // end of search shit
    
    const columns = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.ID - b.ID,
            ellipsis: true,
        },
        {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
            ...getColumnSearchProps('Name'),
        },
        {
            title: 'Job',
            dataIndex: 'Job',
            key: 'Job',
            filters: [
                { text: 'Admin', value: 'Admin' },
                { text: 'Manager', value: 'Manager' },
                { text: 'Nurse', value: 'Nurse' }
            ],
            filteredValue: filteredInfo ? filteredInfo.Job : null,
            onFilter: (value, record) => record.Job.includes(value),
            ellipsis: true,
        },
        {
            title: 'Action',
            key: 'Action',
            width: '15%',
            render: (text, record) => (
                <Space size="middle">
                    <Link to={`/userdetail/${record.ID}`}>
                        Details
                    </Link>
                    {
                        record.Job !== "Manager" ? 
                            <Link to={`/calander/${record.ID}`}>
                                Calander
                            </Link>
                        :
                            null
                    }
                </Space>
            ),
        },
    ];

    const table = () => {
        return(
            <Table 
                columns={columns} 
                dataSource={data} 
                onChange={handleChange} 
                loading={!data}
            />
        );
    }

    return (
        <MainStructure
            content = {
                <div>
                    {pageHeader()}
                    {table()}
                </div>
            }
        />
    );
}

export default UserListPage;