import React from 'react';
import EnhancedVonageAuth from '../components/EnhancedVonageAuth';

const VonageAuth: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <EnhancedVonageAuth />
    </div>
  );
};

export default VonageAuth;