// src/components/QrCodeScanner.jsx
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode'; // NEW IMPORT
import { message } from 'antd'; // Ant Design message for feedback

const qrcodeRegionId = "html5qr-code-full-region"; // Unique ID for the scanner's div

const QrCodeScanner = ({ onScanSuccess, onScanError }) => {
    const scannerRef = useRef(null); // Ref to hold the scanner instance

    useEffect(() => {
        // Create an instance of Html5QrcodeScanner
        const html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId,
            {
                fps: 10, // Frames per second to scan
                qrbox: { width: 250, height: 250 }, // Size of the QR code scanning box
                disableFlip: false, // Don't disable flip to handle mirrored cameras
            },
            /* verbose= */ false // Set to true for more console logs from scanner
        );

        // Render the scanner
        html5QrcodeScanner.render(
            (decodedText, decodedResult) => {
                // Success callback
                message.success(`QR Code Scanned: ${decodedText}`);
                onScanSuccess(decodedText, decodedResult);
                html5QrcodeScanner.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner", error);
                }); // Stop scanning after success
            },
            (errorMessage) => {
                // Error callback (e.g., no QR code found in frame, camera not accessible)
                // console.warn(`QR Code Scan Error: ${errorMessage}`); // Use warn for less critical errors
                // onScanError(errorMessage); // Only call if you want to explicitly handle all non-fatal errors
            }
        );

        // Cleanup function for when the component unmounts
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner on unmount", error);
            });
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div>
            <div id={qrcodeRegionId} style={{ width: '100%' }}></div>
        </div>
    );
};

export default QrCodeScanner;