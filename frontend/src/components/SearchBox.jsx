import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ onSearchComplete }) => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
      // Call the callback function if provided (for closing drawer)
      if (onSearchComplete) {
        onSearchComplete();
      }
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className='search-box'>
      <input
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      ></input>
      <button type='submit' className='p-2'>
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox;
