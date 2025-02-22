import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page: page },
      });

      const { data: responseData } = response;

      console.log('Product Data:', responseData);
      if (responseData.success) {
        setProductData((prev) => [...prev, ...responseData.data]); // Append new products
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/** Page Header **/}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">All Products</h2>

        {/** Product Grid **/}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productData.map((product, index) => (
            <div 
              key={product._id + index} 
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-52 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800 mt-2 truncate">{product.name}</h3>
              <p className="text-green-600 font-bold mt-1">₹{product.price}</p>
            </div>
          ))}
        </div>

        {/** Load More Button **/}
        <div className="flex justify-center mt-8">
          <button 
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Product;
