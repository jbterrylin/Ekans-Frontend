import React, { useState } from 'react';
import { 
    Transfer, 
    Tree
} from 'antd';

function TreeTransfer({ dataSource, data, ...restProps }) {
    const [targetKeys, setTargetKeys] = useState([]);

    const treeTransferOnChange = targetKeys => {
        const newKeys = [];
        for (const key of targetKeys) {
          let temp = data.find(x => x.key === key);
          if (!temp) {
            newKeys.push(key);
          } else {
            if (temp.children) {
              newKeys.push(...temp.children.map(child => child.key));
            } else {
              newKeys.push(temp.key);
            }
          }
        }
        setTargetKeys(newKeys);
    };
    
      const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) > -1;
    
      // const [transferDataSource, setTransferDataSource] = useState([]);
      
      const generateTree = (treeNodes = [], checkedKeys = []) => {
        return treeNodes.map(({ children, ...props }) => ({
          ...props,
          disabled: checkedKeys.includes(props.key),
          children: generateTree(children, checkedKeys)
        }));
      };
    
      
    
      const filterOption = (inputValue, option) => {
        //return option
        // const input = JSON.stringify(inputValue).split("\"")[1];
        // for(var i=0; i<input.length; i++) {
        //   if(JSON.stringify(option.key).indexOf(input[i]) == -1){
        //     return false;
        //   }
        // }
        // return true;
        return (option.key + "").indexOf(inputValue) > -1;
      };

    // setTransferDataSource(temptransferDataSource);
    if (!Array.isArray(dataSource)) {
        return null
    }
    const temptransferDataSource = [];
    function flatten(list = []) {
        list.forEach(item => {
        temptransferDataSource.push(item);
        flatten(item.children);
        });
    }
    flatten(dataSource);
    
    return (
        <Transfer
            {...restProps}
            showSearch
            filterOption={(inputValue, option) => filterOption(inputValue, option)}
            targetKeys={targetKeys}
            // dataSource={transferDataSource}
            dataSource={temptransferDataSource}
            className="tree-transfer"
            render={item => item.title}
            showSelectAll={false}
            onChange={treeTransferOnChange}
        >
            {({ direction, onItemSelect, selectedKeys }) => {
                if (direction === "left") {
                const checkedKeys = [...selectedKeys, ...targetKeys];
                return (
                    <Tree
                    blockNode
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    treeData={generateTree(dataSource, targetKeys)}
                    onCheck={(_, { node: { key } }) => {
                        onItemSelect(key, !isChecked(checkedKeys, key));
                    }}
                    onSelect={(_, { node: { key } }) => {
                        onItemSelect(key, !isChecked(checkedKeys, key));
                    }}
                    />
                );
                }
            }}
        </Transfer>
    );
}

export default TreeTransfer; 