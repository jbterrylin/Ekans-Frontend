import React, { useState, useEffect } from 'react';
import { 
    DatePicker, 
    // Select 
} from 'antd';
import moment from 'moment';

// const { Option } = Select;



function LDatePicker(props) {
    const [date, setDate] = useState(null);
    const [shift, setShift] = useState(null);

    useEffect(() => {
        const action = async function() {
            if(localStorage.getItem('fakelocaltime')) {
                setDate(moment(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[0]));
                setShift(localStorage.getItem('fakelocaltime').split('JBTERRYLIN')[1]);
            } else {
                setDate(moment().format("YYYY-MM-DD"));
                setShift("Q1");
                localStorage.setItem('fakelocaltime', `${moment().format("YYYY-MM-DD")}JBTERRYLIN${"Q1"}`);
            }
        };
        action();
    },[]);  
    
    return (
        shift ?
            <div style={{ display: "inline", marginRight: "32px" }}>
                <DatePicker
                    format="YYYY-MM-DD"
                    renderExtraFooter={() => '（￣︶￣）↗ just for more ez to present ' }
                    size="small"
                    style={{ height: "24px" }}
                    allowClear={false}
                    defaultValue={date}
                    onChange={(value) => {
                        setDate(value);
                        localStorage.removeItem('fakelocaltime');
                        localStorage.setItem('fakelocaltime', `${value.format("YYYY-MM-DD")}JBTERRYLIN${shift}`);
                    }}
                />
                {/* <Select 
                    defaultValue={shift}
                    style={{ width: 120, marginLeft: "16px" }} 
                    size="small" 
                    onChange={(value) => {
                        setShift(value);
                        localStorage.removeItem('fakelocaltime');
                        localStorage.setItem('fakelocaltime', `${date}JBTERRYLIN${value}`);
                    }}
                >
                    <Option value="Q1">Q1</Option>
                    <Option value="Q2">Q2</Option>
                    <Option value="Q3">Q3</Option>
                </Select> */}
            </div>
        :
            null
    );
  }

export default LDatePicker; 