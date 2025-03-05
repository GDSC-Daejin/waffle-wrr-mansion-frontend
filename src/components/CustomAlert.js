import React, { useEffect } from 'react';
import '../styles/CustomAlert.css';

const CustomAlert = ({ message, isOpen, closeAlert }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(closeAlert, 2000); // 2초 후 자동 닫힘
            return () => clearTimeout(timer);
        }
    }, [isOpen, closeAlert]);

    if (!isOpen) return null;

    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert-box">
            <p className="alert-message">{message}</p>
                <button onClick={closeAlert}>확인</button>
            </div>
        </div>
    );
};

export default CustomAlert;
