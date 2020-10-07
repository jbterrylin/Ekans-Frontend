import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import LoginPage from './container/LoginPage';
import RosterListNursePage from './container/RosterListNursePage';
// import RosterListAdminPage from './container/RosterListAdminPage';
import RosterAddPage from './container/RosterAddPage';
import CalanderPage from './container/CalanderPage';
import LeaveAddPage from './container/LeaveAddPage';
import LeaveListPage from './container/LeaveListPage';
import UserAddPage from './container/UserAddPage';
import GroupAddPage from './container/GroupAddPage';
import GroupListPage from './container/GroupListPage';
import ChangeShiftListPage from './container/ChangeShiftListPage';
import ChangeShiftAddPage from './container/ChangeShiftAddPage';
import UserDetailPage from './container/UserDetailPage';
import UserListPage from './container/UserListPage';
import RemoveAll from './container/RemoveAll';
import Example from './container/Example';
import CannotAccess from './container/CannotAccess';
import checkjob from '../src/utils/checkjob';
import messagefunction from '../src/utils/messagefunction';


export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/Example" exact>
          <Example />
        </Route>
        <Route path='/' exact>
          {
            localStorage.getItem('userData') &&
            messagefunction("kill") ?
              <LoginPage />
            :
              <LoginPage /> 
          }
        </Route>
        <Route path="/changeshiftlist" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Nurse"]) &&
            messagefunction("kill") ?
              <ChangeShiftListPage />
            :
              <CannotAccess /> 
          }
        </Route>
        <Route path="/changeshiftadd" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Nurse"]) &&
            messagefunction("kill") ?
              <ChangeShiftAddPage />
            :
              <CannotAccess /> 
          }
        </Route>
        <Route path="/changeshiftedit/:ID" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Nurse"]) &&
            messagefunction("kill") ?
              <ChangeShiftAddPage />
            :
              <CannotAccess /> 
          }
        </Route>

        <Route path="/leaveadd" exact>  
          {
            localStorage.getItem("userData") &&
            checkjob(["Admin"]) &&
            messagefunction("kill") ?
              <LeaveAddPage />
            : 
              <CannotAccess />
          }
        </Route>

        <Route path="/leavelist" exact>  
          {
            localStorage.getItem("userData") &&
            checkjob(["Admin", "Nurse", "PTNurse"]) &&
            messagefunction("kill") ?
              <LeaveListPage />
            :
              <CannotAccess />
          }
        </Route>

        <Route path="/calander" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Nurse","PTNurse"]) &&
            messagefunction("kill") ?
              <CalanderPage />
            :
              <CannotAccess />
          }
        </Route>

        <Route path="/calander/:ID" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Admin","Manager"]) &&
            messagefunction("kill") ?
              <CalanderPage />
            :
              <CannotAccess />
          }
        </Route>

        <Route path="/ra" exact>
          <RemoveAll />
        </Route>

        <Route path="/rosterlist" exact>
          {
            localStorage.getItem('userData') &&
            messagefunction("kill") ?
              <RosterListNursePage />
            :
              <LoginPage /> 
          }
        </Route>
        <Route path="/rosterlist/:Date/:Area/:Shift" exact>
          {
            localStorage.getItem('userData') &&
            messagefunction("kill") ?
              <RosterListNursePage />
            :
              <LoginPage /> 
          }
        </Route>
        {/* <Route path="/rosterlist/:Date/:Area/:Shift" exact>
          <RosterListAdminPage />
        </Route> */}

        <Route path="/rosteradd/:Date/:Area/:Shift" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Admin"]) &&
            messagefunction("kill") ?
              <RosterAddPage />
            :
              <LoginPage /> 
          }
        </Route>
        
        <Route path="/groupedit/:ID" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Manager"]) &&
            messagefunction("kill") ?
              <GroupAddPage />
            :
              <CannotAccess />
          }
        </Route>
        <Route path="/groupadd" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Manager"]) &&
            messagefunction("kill") ?
              <GroupAddPage />
            :
              <CannotAccess />
          }
        </Route>
        <Route path="/grouplist" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Admin","Manager","Nurse"]) &&
            messagefunction("kill") ?
              <GroupListPage />
            :
              <CannotAccess />
          }
        </Route>
        
        <Route path="/userlist" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Manager","Admin"]) &&
            messagefunction("kill") ?
              <UserListPage />
            :
              <CannotAccess />
          }
        </Route>
        <Route path="/userdetail/:ID" exact>
          {
            localStorage.getItem("userData") &&
            messagefunction("kill") ?
              <UserDetailPage />
            :
              <CannotAccess />
          }
        </Route>
        <Route path="/useradd" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Manager", "Admin"]) &&
            messagefunction("kill") ?
              <UserAddPage />
            :
              <CannotAccess />
          }
        </Route>
        <Route path="/useredit/:ID" exact>
          {
            localStorage.getItem("userData") &&
            checkjob(["Manager", "Admin"]) &&
            messagefunction("kill") ?
              <UserAddPage />
            :
              <CannotAccess />
          }
        </Route>
      </Switch>
    </Router>
  );
}
