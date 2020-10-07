import React from 'react';
import { 
    Avatar, 
} from 'antd';
import { 
} from '@ant-design/icons';

function MainStructure(props) {
    return (
        <Avatar 
            icon={
                props.condition === props.icon.condition ?
                    props.icon.icon
                :
                    null
            } 
            src={
                props.condition === props.src.condition ?
                    props.src.src
                :
                    null    
            } 
            size={props.size ? props.size : null} 
            shape={props.shape ? props.shape : "circle"} 
        />
    );
  }
  
  export default MainStructure; 