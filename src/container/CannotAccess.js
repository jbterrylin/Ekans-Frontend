import React from 'react';
import { Result } from 'antd';

function CannotAccess() {

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Result
        style={{ 
          margin: "0",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }} 
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
      />
    </div>
  );
  }
  
  export default CannotAccess; 