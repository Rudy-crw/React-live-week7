import { Outlet, Link } from "react-router";

const FrontendLayout = () => {
  return (
    <>
      <header>
        <div className="d-flex justify-content-between">
          <ul className="nav">
            <li className="nav-item btn ">
              <Link className="nav-link " to="/">
                首頁
              </Link>
            </li>
            <li className="nav-item btn">
              <Link className="nav-link" to="/products">
                產品列表
              </Link>
            </li>
          </ul>
          <ul className="nav">
            <li className="nav-item btn">
              <Link className="nav-link" to="/cart">
                購物車
              </Link>
            </li>
            <li className="nav-item btn">
              <Link className="nav-link" to="/checkout">
                結帳
              </Link>
            </li>
            <li className="nav-item btn">
              <Link className="nav-link" to="/login">
                後台登入
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p className="mt-5 mb-3 text-muted">
          &copy; 2026~∞ Rudy-六角學院- React 直播班
        </p>
      </footer>
    </>
  );
};

export default FrontendLayout;
