// src/pages/RegisterPage.jsx
import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // NEW IMPORT for navigation
import authService from '../services/authService'; // NEW IMPORT for our API service

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  const onFinish = async (values) => {
    try {
      const response = await authService.register(values.username, values.password, values.role);
      message.success(response); // Display success message from backend
      navigate('/login'); // Redirect to login page on successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      message.error(error.message || 'Registration failed. Please try again.'); // Display specific error or generic
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields.');
  };

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card
        title={<Title level={2} style={{ textAlign: 'center' }}>Register</Title>}
        style={{ width: 400 }}
      >
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select your role">
              <Option value="FARMER">Farmer</Option>
              <Option value="DISTRIBUTOR">Distributor</Option>
              <Option value="RESTAURANT">Restaurant</Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <a href="/login">Login here!</a>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;