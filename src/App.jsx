// src/App.jsx
import './App.css'; // Your custom global styles
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd'; // Ant Design Layout and Menu components
import React from 'react'; // Ensure React is imported

// Import your page components (CORRECTED RegisterPage import)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // CORRECTED IMPORT PATH
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import TracePage from './pages/TracePage';

// Simple Home Page component (with background image and improved styling)
const HomePage = () => (
  <div style={{
      padding: '50px',
      textAlign: 'center',
      minHeight: 'calc(100vh - 128px)', // Adjust for header and footer height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("/images/background.jpg")', // Path to your background image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // Adds readability over image
      borderRadius: '8px', // Matches card styling
      overflow: 'hidden' // Ensures image doesn't overflow
  }}>
    <h1 style={{ color: '#fff', fontSize: '3em', marginBottom: '20px' }}>SupplyTrack: Trace Your Food's Journey</h1>
    <p style={{ fontSize: '1.2em' }}>Empowering transparency in the food supply chain.</p>
    <div style={{ marginTop: '30px' }}>
      <Link to="/login" style={{ color: '#fff', fontSize: '1.2em', textDecoration: 'none', marginRight: '20px', border: '1px solid #fff', padding: '10px 20px', borderRadius: '5px' }}>Login</Link>
      <Link to="/register" style={{ color: '#fff', fontSize: '1.2em', textDecoration: 'none', border: '1px solid #fff', padding: '10px 20px', borderRadius: '5px' }}>Register</Link>
    </div>
  </div>
);

const { Header, Content, Footer } = Layout;

function App() {
    const menuItems = [
        { key: '/', label: <Link to="/">Home</Link> },
        { key: '/login', label: <Link to="/login">Login</Link> },
        { key: '/register', label: <Link to="/register">Register</Link> },
        { key: '/products', label: <Link to="/products">Products</Link> },
        { key: '/dashboard', label: <Link to="/dashboard">Dashboard</Link> }, // Added for easy navigation
    ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>SupplyTrack</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
          />
        </Header>
        <Content style={{ padding: '20px 50px', flex: 1 }}> {/* Adjusted padding to be consistent */}
            {/* Main content area wrapped in a div to ensure padding is applied correctly to content */}
            <div style={{ minHeight: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:productId/trace" element={<TracePage />} />
                </Routes>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: 'rgba(255, 255, 255, 0.65)' }}>
            SupplyTrack ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;