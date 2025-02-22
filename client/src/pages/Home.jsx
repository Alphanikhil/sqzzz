import React from 'react';
import banner from '../assets/banner.jpg';
import bannerMobile from '../assets/banner-mobile-BFYswaoU.jpg';
// client/build/assets/banner-mobile-BFYswaoU.jpg
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat);
    const subcategory = subCategoryData.find(sub => sub.category.some(c => c._id === id));
    if (!subcategory) return;
    
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
    console.log(url);
  };

  return (
    <section className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">

        {/** Hero Banner **/}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <img src={banner} className="w-full hidden lg:block" alt="banner" />
          <img src={bannerMobile} className="w-full lg:hidden" alt="banner" />
        </div>

        {/** Category List **/}
        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4 text-center">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {loadingCategory ? (
            new Array(12).fill(null).map((_, index) => (
              <div key={index + "loadingcategory"} className="bg-white rounded-lg p-4 min-h-36 shadow-lg animate-pulse flex flex-col items-center">
                <div className="bg-gray-200 w-16 h-16 rounded-full mb-2"></div>
                <div className="bg-gray-200 h-4 w-20 rounded"></div>
              </div>
            ))
          ) : (
            categoryData.map((cat) => (
              <div 
                key={cat._id + "displayCategory"} 
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer flex flex-col items-center transition-transform duration-300 hover:scale-105"
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
              >
                <img 
                  src={cat.image} 
                  className="w-16 h-16 object-contain rounded-full mb-2" 
                  alt={cat.name} 
                />
                <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">{cat.name}</p>
              </div>
            ))
          )}
        </div>

        {/** Category-wise Product Display **/}
        <div className="mt-8">
          {categoryData?.map((c) => (
            <CategoryWiseProductDisplay 
              key={c?._id + "CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
