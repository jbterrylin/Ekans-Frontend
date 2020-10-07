import React, { useState, useEffect } from 'react';

function RemoveAll() {
    const [alr, setalr] = useState(false);

    useEffect(() => {
        const action = async function() {
            localStorage.clear();
            if(!localStorage.getItem("userData") && !localStorage.getItem("fakelocaltime")) {
                setalr(true);
            }
        };
        action();
    },[]);  

    return (
        <div>
            {
                alr ?
                    "cleared"
                :
                    "havent clear"
            }
        </div>
    );
  }

export default RemoveAll; 