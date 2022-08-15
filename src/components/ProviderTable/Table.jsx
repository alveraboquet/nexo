import React, { useMemo } from 'react';

/*
 * UI Component presenting fetch data for Trades
 */

const Table = ({ data }) => {
  // Handles error when pair is not supported on current platform/provider
  const hasError = useMemo(() => {
    if (data.length === 1) {
      if (data[0].type === 'error') {
        return data[0].status;
      }
    }
    return null;
  }, [data]);

  if (hasError) {
    return <p className={'text-md font-medium text-red-400'}>{hasError}</p>;
  }

  return (
    <table className={'text-xs text-gray-600 w-full'}>
      <thead>
        <tr>
          <th className={'text-left text-bold'}>Time</th>
          <th className={'text-right text-bold'}>Quantity</th>
          <th className={'text-right text-bold'}>Price</th>
        </tr>
      </thead>
      <tbody>
        {data.map((trade, index) => {
          return (
            <tr key={`${trade.provider}-${index}`}>
              <td className={'text-left'}>{trade.time}</td>
              <td className={'text-right'}>{trade.quality}</td>
              <td
                className={
                  trade.type === 'Buy' ? 'text-green-400 text-right' : 'text-red-400 text-right'
                }
              >
                {trade.atPrice}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
