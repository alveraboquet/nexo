import React from 'react';
import { useNavigate } from 'react-router';
import './styles.scss';
import usePair from 'hooks/usePair';

/*
 * Search input UI Component handling change/validate pair
 * and navigates to a proper screen when a matching pair is valid
 */

const Search = () => {
  const navigate = useNavigate();
  const { normalizedPair } = usePair();
  const [search, setSearch] = React.useState(normalizedPair);
  // Check if input is a valid pair of currencies
  const isValid = React.useMemo(() => {
    const pairRegex = /[A-Z]{2,}\/[A-Z]{2,}/gim;
    return pairRegex.test(search);
  }, [search]);

  // Handles input data change
  const handleOnChange = (event) => {
    setSearch(event.target.value.toUpperCase());
  };
  // Handles valid pair and navigates to a proper screen: Pair screen
  const handleSubmit = (event) => {
    event.preventDefault();
    isValid && navigate(`/${search}`, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="search-box"
          placeholder="Search ..."
          required
          value={search}
          onChange={handleOnChange}
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;
