// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Typography, Button, Modal, message, Spin, Statistic, Card, Row, Col } from 'antd'; // Added Statistic, Card, Row, Col
import QrCodeScanner from '../components/QrCodeScanner';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import productService from '../services/productService'; // NEW IMPORT for fetching products

const { Title } = Typography;

const DashboardPage = () => {
  const [isScannerModalVisible, setIsScannerModalVisible] = useState(false);
  const [productCount, setProductCount] = useState(0); // New state for product count
  const [loading, setLoading] = useState(true); // New loading state for dashboard data
  const navigate = useNavigate();

  const showScannerModal = () => {
    setIsScannerModalVisible(true);
  };

  const handleScannerCancel = () => {
    setIsScannerModalVisible(false);
  };

  const handleScanSuccess = (decodedText) => {
    const productId = parseInt(decodedText);

    if (!isNaN(productId)) {
      message.success(`QR Code Scanned for Product ID: ${productId}`);
      navigate(`/products/${productId}/trace`);
      setIsScannerModalVisible(false);
    } else {
      message.error("Invalid QR Code: Expected a numeric Product ID.");
    }
  };

  const handleScanError = (errorMessage) => {
    console.error("QR Scan Error:", errorMessage);
    // message.error(`QR Scan Error: ${errorMessage}`);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const username = authService.getCurrentUsername();
      const password = authService.getCurrentPassword();

      if (!username || !password) {
        message.error('Please log in to view dashboard data.');
        navigate('/login');
        return;
      }

      // Fetch products owned by the current user
      const products = await productService.getAllProducts(username, password);
      setProductCount(products.length);

      // In a more complex dashboard, you'd fetch recent events from a dedicated API:
      // const recentEvents = await eventService.getRecentEvents(username, password);
      // setRecentEvents(recentEvents);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      message.error(error.message || 'Failed to fetch dashboard data.');
      if (error.response && error.response.status === 401) {
        message.error('Authentication required. Please log in.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authService.getCurrentUsername()) { // Only fetch if user seems logged in
      fetchDashboardData();
    } else {
      setLoading(false);
      navigate('/login'); // Redirect if not logged in
    }
  }, [navigate]); // navigate as dependency

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>Welcome to your Dashboard, {authService.getCurrentUsername()}!</Title>
      
      {loading ? (
        <Spin size="large" tip="Loading Dashboard..." />
      ) : (
        <div style={{ marginTop: '30px' }}>
          <Row gutter={16} justify="center">
            <Col span={8}>
              <Card>
                <Statistic title="Products You Own" value={productCount} />
              </Card>
            </Col>
            {/* Add more statistics or charts here */}
            <Col span={8}>
              <Card>
                <Statistic title="Recent Events" value="Coming Soon" /> {/* Placeholder */}
              </Card>
            </Col>
          </Row>
        </div>
      )}

      <Button type="primary" onClick={showScannerModal} style={{ marginTop: '40px', marginRight: '10px' }}>
        Scan Product QR Code
      </Button>

      <Button onClick={() => navigate('/products')} style={{ marginTop: '40px' }}>
        View My Products
      </Button>

      {/* QR Scanner Modal */}
      <Modal
        title="Scan Product QR Code"
        open={isScannerModalVisible}
        onCancel={handleScannerCancel}
        footer={null}
        width={600}
        destroyOnClose={true}
      >
        <QrCodeScanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
        <p style={{ marginTop: '10px', color: '#888' }}>
            Ensure your webcam is accessible.
        </p>
      </Modal>
    </div>
  );
};

export default DashboardPage;