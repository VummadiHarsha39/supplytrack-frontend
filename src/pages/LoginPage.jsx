// src/pages/LoginPage.jsx
import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import authService from '../services/authService'; // Import our API service

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  const onFinish = async (values) => {
    try {
      // Attempt to log in using the authService
      const response = await authService.login(values.username, values.password);

      message.success(response.message); // Display success message
      // In a real application, you'd store tokens (JWT) here
      // For HTTP Basic, a successful response to a protected endpoint confirms login.

      // Redirect to a dashboard or home page after successful login
      navigate('/dashboard'); // We'll create this route and component soon
    } catch (error) {
      console.error('Login failed:', error);
      // Display error message from authService or a generic one
      message.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields.');
  };

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card
        title={<Title level={2} style={{ textAlign: 'center' }}>Login</Title>}
        style={{ width: 400 }}
      >
        <Form
          name="login"
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don't have an account? <a href="/register">Register now!</a>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;