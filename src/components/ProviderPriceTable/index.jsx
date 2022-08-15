import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usePair from '../../hooks/usePair';
import useProviderData from '../../hooks/useProviderData';

/*
 * UI Component presenting current price table in Pair Screen
 */

const ProviderPriceTable = () => {
  const { normalizedPair } = usePair();
  const [sortByPrice, setSortByPrice] = useState(false);

  // Gets fetch data for all providers from websocket/local API and present it
  const { data } = useProviderData(sortByPrice);

  // Handles sorting by price
  const handleSwitchSort = () => {
    setSortByPrice((prev) => !prev);
  };

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-6">
            Provider
          </th>
          <th scope="col" className="py-3 px-6 text-left">
            Pair
          </th>
          <th
            onClick={handleSwitchSort}
            scope="col"
            className="py-3 px-6 text-right cursor-pointer"
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          return (
            <tr
              key={`${item.pair}-${item.provider}`}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {item.provider}
              </th>
              <td className="py-4 px-6 text-left">{item.pair}</td>
              <td className="py-4 px-6 text-right">
                <Link
                  to={`/${normalizedPair}/details`}
                  className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'}
                >
                  {item.price}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProviderPriceTable;
