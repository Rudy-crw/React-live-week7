import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
// SweetAlert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// SweetAlert
const MySwal = withReactContent(Swal);
// 2. 自定義一個 Toast (右上角小提示)
// 這樣之後呼叫只要寫 Toast.fire(...) 即可，不用重複寫設定
const Toast = MySwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// 下面為方法一 使用 navigate 傳遞 state
// import { useLocation } from "react-router";
// 方法二 useParams 較常使用
import { useParams } from "react-router";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 引入 swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SingleProduct = () => {
  // 下面為方法一 使用 navigate 傳遞 state
  // const location = useLocation();
  // const product = location.state?.productData;
  // -----

  //下面為方法二 使用 useParams 接收 :id 的內容，重新打 API 取得資料
  const { id } = useParams();
  const [product, setProduct] = useState();
  useEffect(() => {
    const handleView = async (id) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleView(id);
  }, [id]);
  // -----
  const addCart = async (id, qty) => {
    try {
      const data = {
        product_id: id,
        qty: 1,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      console.log(res.data);
      Toast.fire({
        icon: "success",
        title: "商品已加入購物車",
      });
    } catch (error) {
      console.log(error.response);
    }
  };
  return !product ? (
    <h2>查無產品</h2>
  ) : (
    <>
      <div className="container mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">首頁</li>
            <li className="breadcrumb-item">產品列表</li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.title}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {/* ✅ 修改：麵包屑也加上品牌 */}
              {product.category} {product.title}
            </li>
          </ol>
        </nav>
        <div className="row">
          {/* =======================
            左側：圖片輪播區 (佔 7 份)
            ======================= */}
          <div className="col-md-7">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              className="rounded-3 shadow-sm" // 移除 card，改用圓角和陰影
              style={{
                height: "500px", // 稍微加高一點讓圖片更清楚
                backgroundColor: "#f8f9fa", // 淺灰底色，避免透明圖去背看起來奇怪
              }}
            >
              {/* 1. 主圖 */}
              <SwiperSlide>
                <img
                  src={product.imageUrl}
                  className="w-100 h-100 object-fit-contain" // 保持比例，完整顯示
                  alt={`${product.category} ${product.title}`}
                />
              </SwiperSlide>

              {/* 2. 附圖 */}
              {product.imagesUrl?.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={url}
                    className="w-100 h-100 object-fit-contain"
                    alt={`附圖-${index}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* =======================
            右側：產品資訊區 (佔 5 份)
            ======================= */}
          <div className="col-md-5 mt-4 mt-md-0">
            {" "}
            {/* mt-md-0 確保電腦版上方不留白 */}
            <div className="d-flex flex-column h-100 justify-content-center">
              {/* 1. 標籤與標題 */}
              <div className="mb-3">
                <span className="badge bg-dark">{product.style}</span>
              </div>

              <h1 className="fw-bold mb-3">
                {product.category} {product.title}
              </h1>

              {/* 2. 描述內容 */}
              <p className="fs-5 text-muted mb-4">{product.description}</p>

              {/* 3. 詳細規格 (如果內容很多，可以考慮用 accordion，這裡先直接顯示) */}
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-0 text-secondary">{product.content}</p>
              </div>

              {/* 4. 價格區塊 */}
              <div className=" mb-4">
                <p className="card-text fs-5">
                  <del className="text-muted me-2">
                    原價：{currency(product.origin_price)}
                  </del>
                  售價：
                  <span className="fw-bold text-danger display-6">
                    {currency(product.price)}
                  </span>
                  <small className="text-body-secondary ms-1">
                    /{product.unit}
                  </small>
                </p>
              </div>

              {/* 5. 購買按鈕區塊 (置底或顯眼處) */}
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg py-3 fw-bold shadow-sm"
                  onClick={() => addCart(product.id)}
                >
                  <i className="bi bi-cart-plus-fill me-2"></i> 加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 商品區塊原先版本
// <div className="card ">
//   {/* ===========================================
//       SWIPER 區塊開始
//       =========================================== */}
//   <Swiper
//     modules={[Navigation, Pagination]}
//     navigation
//     pagination={{ clickable: true }}
//     spaceBetween={10}
//     slidesPerView={1}
//     loop={true}
//     className="w-100 bg-light rounded-top" // 加上一些樣式
//     style={{ height: "400px" }} // 建議固定高度，避免圖片跳動
//   >
//     {/* 1. 先放主圖 (imageUrl) */}
//     <SwiperSlide>
//       <img
//         src={product.imageUrl}
//         className="w-100 h-100 object-fit-contain" // object-fit-contain 確保圖片完整顯示不變形
//         alt={product.title}
//       />
//     </SwiperSlide>

//     {/* 2. 再跑迴圈放附圖 (imagesUrl)
//        注意：要檢查 product.imagesUrl 是否存在，避免報錯
//     */}
//     {product.imagesUrl?.map((url, index) => (
//       <SwiperSlide key={index}>
//         <img
//           src={url}
//           className="w-100 h-100 object-fit-contain"
//           alt={`附圖-${index}`}
//         />
//       </SwiperSlide>
//     ))}
//   </Swiper>
//   {/* ===========================================
//       SWIPER 區塊結束
//       =========================================== */}

//   <div className="card-body">
//     <h5 className="card-title">
//       {product.category} {product.title}{" "}
//       <span className="badge rounded-pill text-bg-danger ms-2">
//         {product.style}
//       </span>
//     </h5>
//     <p className="card-text">{product.description}</p>
//     <p className="card-text">{product.content}</p>
//     <p className="card-text">
//       <del>原價：{product.origin_price}</del> 售價：
//       {product.price}
//       <small className="text-body-secondary">/{product.unit}</small>
//     </p>
//     <button
//       type="button"
//       className="btn btn-primary"
//       onClick={() => addCart(product.id)}
//     >
//       加入購物車
//     </button>
//   </div>
// </div>

export default SingleProduct;
