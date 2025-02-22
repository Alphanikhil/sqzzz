import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 100,
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  return (
    <section className="sticky top-24 lg:top-20 bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-screen-xl">
        
        {/** Product List Only (Fixed for Mobile) **/}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Explore Products</h2>
        
        <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative scroll-smooth">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {
              data.map((p, index) => (
                <div 
                  key={p._id + "productSubCategory" + index} 
                  className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full"
                >
                  <CardProduct data={p} />
                </div>
              ))
            }
          </div>
        </div>

        {loading && <Loading />}
        
      </div>
    </section>
  );
};

export default ProductListPage;
