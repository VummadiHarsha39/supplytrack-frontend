// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Table, message, Modal, Select } from 'antd'; // Added Select for roles
import { PlusOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons'; // Added icons
import authService from '../services/authService';
import productService from '../services/productService';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select; // For role selection in handover (if needed, or user selection)


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Create Product Modal
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  // State for Log Event Modal
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [eventForm] = Form.useForm();
  const [currentProductForEvent, setCurrentProductForEvent] = useState(null); // Track which product to log event for

  // State for Handover Modal
  const [isHandoverModalVisible, setIsHandoverModalVisible] = useState(false);
  const [handoverForm] = Form.useForm();
  const [currentProductForHandover, setCurrentProductForHandover] = useState(null); // Track which product to handover

  const navigate = useNavigate();

  // Columns for the Ant Design Table
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Current Status', dataIndex: 'currentStatus', key: 'currentStatus' },
    { title: 'Location', dataIndex: 'currentLocation', key: 'currentLocation' },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    { title: 'Owner ID', dataIndex: 'ownerUserId', key: 'ownerUserId' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => navigate(`/products/${record.id}/trace`)}>Trace</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEventModal(record)}>Log Event</Button> {/* NEW BUTTON */}
          <Button type="link" icon={<SwapOutlined />} onClick={() => showHandoverModal(record)}>Handover</Button> {/* NEW BUTTON */}
        </span>
      ),
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const username = authService.getCurrentUsername();
      const password = authService.getCurrentPassword();

      if (!username || !password) {
        message.error('Please log in to view products.');
        navigate('/login');
        return;
      }
      
      const response = await productService.getAllProducts(username, password);
      setProducts(response);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error(error.message || 'Failed to fetch products. Please try again.');
      if (error.response && error.response.status === 401) {
        message.error('Authentication required. Please log in.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authService.getCurrentUsername() && authService.getCurrentPassword()) {
        fetchProducts();
    } else {
        setLoading(false);
        message.info('Please log in to view products.');
        navigate('/login');
    }
  }, [navigate]);

  // --- Create Product Modal Logic ---
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  const onFinishCreateProduct = async (values) => {
    try {
      const username = authService.getCurrentUsername();
      const password = authService.getCurrentPassword();

      if (!username || !password) {
        message.error('Please log in to create products.');
        navigate('/login');
        return;
      }

      const response = await productService.createProduct(
        values.name,
        values.origin,
        values.initialLocation,
        username,
        password
      );
      message.success('Product created successfully!');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Failed to create product:', error);
      message.error(error.message || 'Failed to create product. Please try again.');
      if (error.response && error.response.status === 401) {
        message.error('Authentication required. Please log in.');
        navigate('/login');
      }
    }
  };

  // --- Log Event Modal Logic ---
  const showEventModal = (product) => {
    setCurrentProductForEvent(product);
    setIsEventModalVisible(true);
  };

  const handleEventCancel = () => {
    setIsEventModalVisible(false);
    eventForm.resetFields();
    setCurrentProductForEvent(null);
  };

  const onFinishLogEvent = async (values) => {
    if (!currentProductForEvent) return;

    try {
      const username = authService.getCurrentUsername();
      const password = authService.getCurrentPassword();

      if (!username || !password) {
        message.error('Please log in to log events.');
        navigate('/login');
        return;
      }

      // In a real app, you'd get the actorUserId from a user context/token
      // For simplicity, we'll assume the logged-in user's ID can be derived from username by backend
      // Or, we'd have a separate backend endpoint to get the authenticated user's full details (including ID)
      // For now, we pass the ownerUserId to productService.logEvent and the backend will manage actorUserId from principal
      
      // TEMPORARY: Since backend requires actorUserId, we will pass a dummy value or
      // assume current user ID is available or fetched.
      // Better: Backend `logEvent` should use `@AuthenticationPrincipal` for `actorUserId` as well.
      // We already refined this in `ProductController` and `EventService`.
      // So, `actorUserId` should not be sent from frontend's `logEvent` call.
      // Let's remove `actorUserId` from `productService.logEvent` function parameters.

      // We need to re-verify `productService.logEvent` in `productService.js`

      const response = await productService.logEvent(
        currentProductForEvent.id,
        values.eventType,
        values.eventDescription,
        values.location,
        // actorUserId will be inferred by backend from @AuthenticationPrincipal
        username,
        password
      );
      message.success('Event logged successfully!');
      setIsEventModalVisible(false);
      eventForm.resetFields();
      setCurrentProductForEvent(null);
      fetchProducts(); // Refresh product list to see status update
    } catch (error) {
      console.error('Failed to log event:', error);
      message.error(error.message || 'Failed to log event. Please try again.');
      if (error.response && error.response.status === 401) {
        message.error('Authentication required. Please log in.');
        navigate('/login');
      }
    }
  };

  // --- Handover Modal Logic ---
  const showHandoverModal = (product) => {
    setCurrentProductForHandover(product);
    setIsHandoverModalVisible(true);
  };

  const handleHandoverCancel = () => {
    setIsHandoverModalVisible(false);
    handoverForm.resetFields();
    setCurrentProductForHandover(null);
  };

  const onFinishHandover = async (values) => {
    if (!currentProductForHandover) return;

    try {
      const username = authService.getCurrentUsername();
      const password = authService.getCurrentPassword();

      if (!username || !password) {
        message.error('Please log in to handover products.');
        navigate('/login');
        return;
      }

      const response = await productService.handoverProduct(
        currentProductForHandover.id,
        values.newOwnerUserId, // This ID must exist in backend
        values.handoverLocation,
        values.handoverDescription,
        username,
        password
      );
      message.success(response.message || 'Product handed over successfully!');
      setIsHandoverModalVisible(false);
      handoverForm.resetFields();
      setCurrentProductForHandover(null);
      fetchProducts(); // Refresh product list to see new owner
    } catch (error) {
      console.error('Failed to handover product:', error);
      message.error(error.message || 'Failed to handover product. Please try again.');
      if (error.response && error.response.status === 401) {
        message.error('Authentication required. Please log in.');
        navigate('/login');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>My Products</Title>

      <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} style={{ marginBottom: 20 }}>
        Add New Product
      </Button>

      <Table columns={columns} dataSource={products} rowKey="id" loading={loading} />

      {/* --- Create Product Modal --- */}
      <Modal
        title="Create New Product"
        open={isCreateModalVisible}
        onCancel={handleCreateCancel}
        footer={null}
      >
        <Form
          form={createForm}
          name="createProduct"
          onFinish={onFinishCreateProduct}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input product name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Origin"
            name="origin"
            rules={[{ required: true, message: 'Please input product origin!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Initial Location"
            name="initialLocation"
            rules={[{ required: true, message: 'Please input initial location!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- Log Event Modal --- */}
      <Modal
        title={`Log Event for Product: ${currentProductForEvent?.name}`}
        open={isEventModalVisible}
        onCancel={handleEventCancel}
        footer={null}
      >
        <Form
          form={eventForm}
          name="logEvent"
          onFinish={onFinishLogEvent}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Event Type"
            name="eventType"
            rules={[{ required: true, message: 'Please select event type!' }]}
          >
            <Select placeholder="Select event type">
              <Option value="SHIPPED">SHIPPED</Option>
              <Option value="RECEIVED">RECEIVED</Option>
              <Option value="QUALITY_CHECK">QUALITY_CHECK</Option>
              <Option value="DAMAGED">DAMAGED</Option>
              <Option value="SOLD">SOLD</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="eventDescription"
            rules={[{ required: true, message: 'Please enter event description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter event location!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Log Event
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- Handover Modal --- */}
      <Modal
        title={`Handover Product: ${currentProductForHandover?.name}`}
        open={isHandoverModalVisible}
        onCancel={handleHandoverCancel}
        footer={null}
      >
        <Form
          form={handoverForm}
          name="handoverProduct"
          onFinish={onFinishHandover}
          autoComplete="off"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="New Owner User ID"
            name="newOwnerUserId"
            rules={[{ required: true, message: 'Please enter the new owner\'s User ID!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Handover Location"
            name="handoverLocation"
            rules={[{ required: true, message: 'Please enter handover location!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="handoverDescription"
            rules={[{ required: true, message: 'Please enter handover description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Handover Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;