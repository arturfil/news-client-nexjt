"use client"

import React from 'react';

export const Alert = ({ children, variant = 'info' }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[variant]}`}>
      {children}
    </div>
  );
};
