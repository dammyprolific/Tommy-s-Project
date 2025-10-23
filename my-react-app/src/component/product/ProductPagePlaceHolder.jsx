import React from 'react';

const ProductPagePlaceHolder = () => {
  return (
    <section className='py-3'>
      <div className='container px-4 px-lg-5 my-5'>
        <div className='row gx-4 gx-lg-5 align-items-center'>
          {/* Left side: main image placeholder */}
          <div className='col-md-6'>
            <div
              className='placeholder bg-secondary mb-4'
              style={{ width: '100%', height: 400, borderRadius: 8 }}
            ></div>

            {/* Placeholder for extra images below */}
            <div className="d-flex flex-wrap gap-2 mt-2">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="placeholder bg-secondary"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right side: text placeholders */}
          <div className='col-md-6'>
            <div className='placeholder-glow mb-3'>
              <span className='placeholder col-4'></span>
            </div>
            <div className='placeholder-glow mb-4'>
              <span className='placeholder col-12' style={{ height: 32 }}></span>
            </div>
            <div className='placeholder-glow mb-3'>
              <span className='placeholder col-3'></span>
            </div>

            <div className='lead'>
              <div className='placeholder-glow mb-2'>
                <span className='placeholder col-12'></span>
              </div>
              <div className='placeholder-glow mb-2'>
                <span className='placeholder col-12'></span>
              </div>
              <div className='placeholder-glow mb-2'>
                <span className='placeholder col-12'></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPagePlaceHolder;
