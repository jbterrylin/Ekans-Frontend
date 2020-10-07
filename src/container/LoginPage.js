import React, { useState } from 'react';  
import { 
  Form, 
  Input, 
  Button, 
  // Checkbox, 
  Typography, 
  message 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined
} from '@ant-design/icons';
import request from '../utils/apisauce';
import{ useHistory } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;

function LoginPage() {
  const router = useHistory();
  const [submitBtn, setSubmitBtn] = useState(false);

  const submitInput = async (values) => {
    setSubmitBtn(true);
    const temp = await request("GET", `Login?ID=${values.ID}&Password=${values.Password}`);
    if(temp.Ok) {
      localStorage.setItem('userData', JSON.stringify(temp.Result));
      localStorage.setItem('fakelocaltime', `${moment().format("YYYY-MM-DD")}JBTERRYLIN${"Q1"}`);
      router.push('/rosterlist');
      window.location.reload();
    } else {
      Message("fail");
      setSubmitBtn(false);
    }
  };

  const Message = (status) => {
    message.destroy();
    if (status === "loading") {
      message.loading('Checking ...', 2)
    } else if (status === "fail") {
      message.error('Wrong id or password ...', 2)
    }
  }
  
  return (
    <div style={{ overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginTop: "64px" }}>
            <img style={{ width: "15%", height: "15%" }} src={require("../resource/logo.png")} alt="logo" />
            <br />
            <Title>Ekans Hospital</Title>
        </div>

        <div style={{ textAlign: "-webkit-center", marginTop: "32px" }}>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={submitInput}
            style={{ maxWidth: "380px" }}
          >

            <Form.Item
              name="ID"
              rules={[{ required: true, message: 'Please input your ID!' }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="ID" 
              />
            </Form.Item>

            <Form.Item
              name="Password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="Password"
                placeholder="Password"
              />
            </Form.Item>

            {/* <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox  style={{ float: "left", marginLeft: "2px" }}>Remember me</Checkbox>
              </Form.Item>
              <a style={{ float: "right" }} href="www.facebook.com">
                Forgot password
              </a>
            </Form.Item> */}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: "100%" }}
                onClick={() => Message("loading")}
                disabled={submitBtn}
              >
                Log in
              </Button>
            </Form.Item>

          </Form>
        </div>
    </div>
  );
}

export default LoginPage; 
