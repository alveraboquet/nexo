import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search } from 'components';
import { Pair } from 'screens';

// Basic routing to handle URL Changes
const RouterView = () => {
  return (
    <div className={'container mx-auto px-4 flex flex-col justify-start mt-40'}>
      <Search />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/:first/:second/" element={<Pair />} />
        <Route path="/:first/:second/details" element={<Pair />} />
      </Routes>
    </div>
  );
};

export default RouterView;
