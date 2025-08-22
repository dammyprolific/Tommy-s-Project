import React from 'react';

const Placeholderss = () => {
  return (
    <div className='col-md-3 mb-5'>
      <div className='card' aria-hidden='true'>
        <div
          className='faceholder-glow'
          style={{ height: '180px', backgroundColor: 'lightgray' }}
        ></div>

        <div className='card-body'>
          <p className='card-text faceholder-glow'>
            <span className='faceholder col-12 mb-2'></span>
            <span className='faceholder col-12'></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Placeholderss;
