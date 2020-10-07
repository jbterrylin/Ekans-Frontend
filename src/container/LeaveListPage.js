import React, { useState, useEffect } from 'react';
import { 
    PageHeader, 
    Table,
    Input,
    Space,
    Button,
    Typography,
    message,
    Spin
} from 'antd';
import { 
    SearchOutlined
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
import request from '../utils/apisauce';
import { Link } from "react-router-dom";
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import checkjob from '../utils/checkjob';

const { Text } = Typography;

function LeaveListPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const action = async function() {
        // get all User
        var temp1 = await request("GET", `Leave`);
        if(temp1.Ok) {
            temp1 = await request("GET", `Leave?limit=${temp1.Result.meta.total ? temp1.Result.meta.total : 10}`);
            if(temp1.Ok) {
            temp1.Result.result.forEach((element) => {
                element.DateTime = moment(element.DateTime).format("YYYY-MM-DD");
                element.key= element.ID;
            });
            setData(temp1.Result.result);
            }
        }
        };
        action();
    },[]);

    const getData = async() => {
        var temp1 = await request("GET", `Leave`);
        if(temp1.Ok) {
            temp1 = await request("GET", `Leave?limit=${temp1.Result.meta.total ? temp1.Result.meta.total : 10}`);
            if(temp1.Ok) {
                temp1.Result.result.forEach((element) => {
                    element.DateTime = moment(element.DateTime).format("YYYY-MM-DD");
                    element.key= element.ID;
                });
                setData(temp1.Result.result ? temp1.Result.result : []);
            }
        }
    }

    const pageHeader = () => {
        return (
        <PageHeader
            title="Leave List"
            style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }} 
            extra={[
                checkjob(["Admin"]) ?
                    <Button key="2" type="primary">
                        <Link to="/leaveadd">Add Leave</Link>
                    </Button>
                :
                  null
              ]} 
        />
        );
    }

    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [searchedColumn, setSearchedColumn] = useState(null);
    const [searchInput, setSearchInput] = useState(null);

    const handleChange = (filters) => {
        //('Various parameters', pagination, filters, sorter)
        setFilteredInfo(filters);
        //setSortedInfo(sorter);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

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
            title: 'NurseID',
            dataIndex: 'NurseID',
            key: 'NurseID',
            sorter: (a, b) => a.ID - b.ID,
            ellipsis: true,
        },
        {
            title: 'Nurse Name',
            dataIndex: 'NurseName',
            key: 'NurseName',
            ...getColumnSearchProps('NurseName'),
        },
        {
            title: 'date',
            dataIndex: 'DateTime',
            key: 'DateTime',
            sorter: (a, b) => moment(a.DateTime).diff(moment(b.DateTime), 'days'),
            ...getColumnSearchProps('DateTime'),
            ellipsis: true,
        },
        {
            title: 'Shift',
            dataIndex: 'Shift',
            key: 'Shift',
            filters: [
                { text: 'Q1', value: 'Q1' },
                { text: 'Q2', value: 'Q2' },
                { text: 'Q3', value: 'Q3' }
            ],
            filteredValue: filteredInfo ? filteredInfo.Shift : null,
            onFilter: (value, record) => record.Shift.includes(value),
            ellipsis: true,
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
            filters: [
                { text: 'MC', value: 'MC' },
                { text: 'Annual Leave', value: 'Annual Leave' },
            ],
            filteredValue: filteredInfo ? filteredInfo.Type : null,
            onFilter: (value, record) => record.Type.includes(value),
            ellipsis: true,
        },
        {
            title: 'Action',
            key: 'Action',
            width: '15%',
            render: (text, record) => (
                <Space size="middle">
                    {
                        moment(record.DateTime).isAfter(moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]).add(-1, 'days')) &&
                        checkjob(['Admin']) ?
                            <Text
                                style={{ color: "#1890ff", cursor: "pointer" }}
                                onClick={async() => {
                                    var temp1 = await request("DELETE", `Leave/${record.ID}`);
                                    if(temp1.Ok) {
                                        message.success(`${record.NurseName} Leave's delete successfully.`);
                                        getData();
                                    } else {
                                        // havent handle
                                    }
                                }}
                            >
                                Delete
                            </Text>
                        :
                            ""
                    }
                </Space>
            ),
        },
    ];

  const table = () => {
        return(
            <Table 
                columns={columns} 
                dataSource={
                    checkjob(['Admin'])?
                        data
                    :
                        data.filter((val) => val.NurseID === JSON.parse( localStorage.getItem("userData") ).ID)
                } 
                onChange={handleChange} 
                expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>Approved by: {record.ManagerName}<br />Ramark: {record.Remark}</p>,
                }}
            />
        );
    }

    return (
        <MainStructure
            content = {
                data ?
                    <div>
                        {pageHeader()}
                        {table()}
                    </div>
                :
                    <div style={{ height: "100%", position: "relative" }}>
                        <Spin 
                            style={{ margin: "0",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }} 
                        />
                    </div>
            }
        />
    );
  }
  
  export default LeaveListPage; 