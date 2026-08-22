import React from 'react';

export const DataProvider = ({ children }) => {
  return <>{children}</>;
};

export { useData } from './useData';
export default DataProvider;
