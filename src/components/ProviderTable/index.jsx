import React from 'react';
import Table from './Table';

const ProviderTable = ({ data, provider }) => {
  if (!data) return null;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-800">{provider}</div>
        <Table data={data} />
      </div>
    </div>
  );
};

export default ProviderTable;
