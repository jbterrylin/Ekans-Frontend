import React, {  } from 'react';
import { 
    PageHeader, 
    // Table,
    // Input,
    // Space,
    // Button,
    // Switch
} from 'antd';
import { 
    // SearchOutlined
} from '@ant-design/icons';
import MainStructure from '../component/MainStructure';
// import request from '../utils/apisauce';
// import Highlighter from 'react-highlight-words';
// import { Link } from "react-router-dom";

function RosterListAdminPage() {

    // useEffect(() => {
        // const action = async function() {
        //   var temp = await request("GET", `Group`);
        //   if(temp.Ok) {
        //     temp = await request("GET", `Group?limit=${temp.Result.meta.total}`);
        //     if(temp.Ok) {
        //       temp.Result.result.forEach((element) => {
        //         element.key = element.ID;
        //         element.title = element.ID + "-" + element.Name;
        //       });
        //       setData(temp.Result.result);
        //     }
        //   }
        // };
    //     action();
    // }, []);
    
    const pageHeader = () => {
        return (
          <PageHeader
            title={`Roster List`}
            style={{ border: "1px solid rgb(235, 237, 240)", borderLeft: "0px" }}
          />
        );
    }

    return (
        <MainStructure
            content = {
                <div>
                    {pageHeader()}
                </div>
            }
        />
    );
  }

export default RosterListAdminPage; 