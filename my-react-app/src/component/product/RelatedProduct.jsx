import React from 'react';
import HomeCard from '../homee/HomeCard';

const RelatedProduct = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <section className='py-3 bg-light'>
      <div className='container px-4 px-lg-5 mt-3'>
        <h2 className='fw-bolder mb-4'>Related Products</h2>
        <div className='row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center'>
          {products.map(products => (
            <HomeCard key={products.id} product={products} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProduct;
