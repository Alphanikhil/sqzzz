import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import Divider from '../components/Divider';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];

  const [data, setData] = useState({
    name: "",
    image: [],
    description: "",
  });

  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 gap-8 animate-fadeIn">
      
      {/** Left Side - Product Image Gallery **/}
      <div>
        <div className="bg-white rounded-lg shadow-md flex items-center justify-center">
          <img
            src={data.image[image]}
            className="w-full h-full object-contain p-4"
            alt="Product"
          />
        </div>

        {/** Image Indicators **/}
        <div className="flex items-center justify-center gap-3 my-3">
          {data.image.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                index === image ? "bg-green-500" : "bg-gray-300"
              }`}
              onClick={() => setImage(index)}
            ></div>
          ))}
        </div>

        {/** Image Thumbnail Scroll **/}
        <div className="relative">
          <div ref={imageContainer} className="flex gap-4 overflow-x-auto scrollbar-none">
            {data.image.map((img, index) => (
              <div
                className="w-20 h-20 shadow-md rounded-lg cursor-pointer border border-gray-300 hover:border-green-500 transition-all"
                key={img + index}
                onClick={() => setImage(index)}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain p-2" />
              </div>
            ))}
          </div>

          {/** Left & Right Scroll Buttons **/}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 hidden lg:flex">
            <button onClick={handleScrollLeft} className="bg-white p-2 rounded-full shadow-lg">
              <FaAngleLeft />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden lg:flex">
            <button onClick={handleScrollRight} className="bg-white p-2 rounded-full shadow-lg">
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>

      {/** Right Side - Product Details **/}
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-green-300 w-fit px-3 py-1 rounded-full text-sm">1 Day Delivery</p>
        <h2 className="text-2xl font-bold mt-2">{data.name}</h2>
        <p className="text-gray-600">{data.unit}</p>
        <Divider />

        {/** Price & Discount **/}
        <div>
          <p className="text-gray-700 font-semibold">Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl text-green-600">
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </p>
            </div>
            {data.discount && (
              <>
                <p className="line-through text-gray-500">{DisplayPriceInRupees(data.price)}</p>
                <p className="font-bold text-green-600 lg:text-2xl">
                  {data.discount}% <span className="text-base text-gray-500">Off</span>
                </p>
              </>
            )}
          </div>
        </div>

        {/** Add to Cart Button **/}
        <div className="my-6">
          {data.stock === 0 ? (
            <p className="text-lg text-red-500">Out of Stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>

        {/** Product Description **/}
        <div className="mt-6">
          <p className="font-semibold text-lg">Description</p>
          <p className="text-gray-600 whitespace-pre-line">{data.description}</p>
        </div>

        {/** Additional Product Details **/}
        <div className="mt-4">
          <p className="font-semibold text-lg">Unit</p>
          <p className="text-gray-600">{data.unit}</p>
        </div>

        {data?.more_details &&
          Object.keys(data?.more_details).map((element, index) => (
            <div key={index} className="mt-2">
              <p className="font-semibold">{element}</p>
              <p className="text-gray-600">{data?.more_details[element]}</p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default ProductDisplayPage;
