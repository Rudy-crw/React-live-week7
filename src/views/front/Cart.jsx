import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

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
  // didOpen: (toast) => {
  //   toast.onmouseenter = Swal.stopTimer;
  //   toast.onmouseleave = Swal.resumeTimer;
  // },
});

const Cart = () => {
  const [cart, setCart] = useState({});

  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        setCart(res.data.data);
        console.log("res.data.data:", res.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getCart();
  }, []);

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      console.log(res);

      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      Toast.fire({
        icon: "success",
        title: "商品數量已成功更新",
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const delCart = async (cartId) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      console.log(res);
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      Toast.fire({
        icon: "success",
        title: "商品刪除成功！",
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const delAllCart = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      console.log(res);
      const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res2.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    // src/views/front/Cart.jsx
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => {
            delAllCart();
          }}
          disabled={!cart.carts?.length}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th className="text-end" scope="col">
              小計
            </th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    delCart(cartItem.id);
                  }}
                >
                  刪除
                </button>
              </td>
              <td>
                <img
                  src={cartItem.product.imageUrl}
                  alt={cartItem.product.title}
                  style={{ width: 100 }}
                />
              </td>
              <th scope="row">
                {cartItem.product.category} {cartItem.product.title}
              </th>

              <td>
                {cartItem.product.qty}

                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={cartItem.qty}
                    onChange={(e) => {
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value),
                      );
                    }}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="4">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Cart;
