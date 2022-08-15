import React from 'react';
import { DetailsModal } from 'components';
import { ProviderPriceTable } from 'components';
import usePair from '../../hooks/usePair';

const Pair = () => {
  const { isModalOpen } = usePair();
  return (
    <>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg pt-8">
        <ProviderPriceTable />
      </div>
      <DetailsModal isOpen={isModalOpen} />
    </>
  );
};

export default Pair;
