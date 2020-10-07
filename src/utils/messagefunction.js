import {
  message 
} from 'antd';

const messagefunction = (status) => {
    message.destroy();
    if (status === "loading") {
        message.loading('Loading ...', 2)
    } else if (status === "fail") {
        message.error('Wrong id or password ...', 2)
    } else if (status === "Success") {
        message.success("Success", 2);
    } else if (status === "kill") {
        message.destroy();
    }
    return true;
}

export default messagefunction;