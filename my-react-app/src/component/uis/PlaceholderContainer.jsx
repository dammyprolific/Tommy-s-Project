import React from 'react'
import Placeholder from './Placeholderss'

const PlaceholderContainer = () => {
    const placeNumbers = [...Array(12).keys()].slice(0);

    return (
        <section className='py-5' id='shop'>
            <h4 style={{ textAlign: "center" }}> Our Products</h4>
            <div className='container px-4 px-lg-5 mt-5'>
                <div className='row justify-content-center'>
                    {placeNumbers.map(num => (
                        <div key={num} className="col-6 col-md-4 col-lg-3 mb-4">
                            <Placeholder />
                        </div>
                    ))}

                </div>

            </div>

        </section>

    )
}

export default PlaceholderContainer
