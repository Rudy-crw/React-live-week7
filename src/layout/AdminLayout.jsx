import { Outlet, Link } from "react-router";

const AdminLayout = () => {
  return (
    <>
      <header>
        <div className="d-flex justify-content-between">
          <ul className="nav">
            <li className="nav-item btn">
              <Link className="nav-link" to="/admin/products">
                後台產品列表
              </Link>
            </li>
            <li className="nav-item btn">
              <Link className="nav-link" to="/admin/orders">
                後台訂單列表
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

export default AdminLayout;
