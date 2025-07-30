// src/pages/TracePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Typography, message, Spin, Descriptions, Button } from 'antd'; // ADDED Button here// Added Descriptions for product info
import authService from '../services/authService';
import productService from '../services/productService';

const { Title, Text } = Typography;

const TracePage = () => {
  const { productId } = useParams(); // Get productId from URL parameter
  const navigate = useNavigate();
  const [productTrace, setProductTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductTrace = async () => {
      setLoading(true);
      setError(null);
      try {
        const username = authService.getCurrentUsername();
        const password = authService.getCurrentPassword();

        if (!username || !password) {
          message.error('Please log in to view product trace.');
          navigate('/login');
          return;
        }

        const traceData = await productService.getProductTrace(productId, username, password);
        setProductTrace(traceData);
      } catch (err) {
        console.error('Failed to fetch product trace:', err);
        setError(err.message || 'Failed to load product trace. Please try again.');
        message.error(err.message || 'Failed to load product trace.');
        if (err.response && err.response.status === 401) {
          message.error('Authentication required. Please log in.');
          navigate('/login');
        } else if (err.response && err.response.status === 404) {
          message.error('Product not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductTrace();
    } else {
      setError('No product ID provided for trace.');
      setLoading(false);
    }
  }, [productId, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading Trace Data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <Title level={3} type="danger">Error: {error}</Title>
        <Button type="primary" onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  if (!productTrace) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>No Trace Data Available</Title>
        <Button type="primary" onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const eventColumns = [
    { title: 'Event ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'eventType', key: 'eventType' },
    { title: 'Description', dataIndex: 'eventDescription', key: 'eventDescription' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleString(),
    },
    { title: 'Actor User ID', dataIndex: 'actorUserId', key: 'actorUserId' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        Trace for Product: <Text code>{productTrace.product.id}</Text> - {productTrace.product.name}
      </Title>

      <Card title="Current Product Details" style={{ marginBottom: '30px' }}>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Name">{productTrace.product.name}</Descriptions.Item>
          <Descriptions.Item label="Origin">{productTrace.product.origin}</Descriptions.Item>
          <Descriptions.Item label="Current Status">{productTrace.product.currentStatus}</Descriptions.Item>
          <Descriptions.Item label="Current Location">{productTrace.product.currentLocation}</Descriptions.Item>
          <Descriptions.Item label="Current Owner ID">{productTrace.product.ownerUserId}</Descriptions.Item>
          <Descriptions.Item label="Created Date">{new Date(productTrace.product.createdDate).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Event History" >
        <Table
          columns={eventColumns}
          dataSource={productTrace.eventHistory}
          rowKey="id"
          pagination={false} // No pagination for full history
          loading={loading} // Use local loading state
        />
      </Card>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button type="primary" onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    </div>
  );
};

export default TracePage;