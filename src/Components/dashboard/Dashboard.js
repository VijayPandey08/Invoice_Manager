import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../../Components/dashboard/Dashboard.css";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="dashboard_wrapper">
      <div className="side_nav">
        <div className="profile_info">
          <img src={localStorage.getItem("photoURL")} alt="" />
          <div>
            <p>{localStorage.getItem("cNAME")}</p>
          </div>
        </div>
        <hr />
        <div className="menu">
          <Link to={"/dashboard/home"} className="menu-link">
            <i className="fa-solid fa-house"></i> Home
          </Link>
          <Link to={"/dashboard/invoices"} className="menu-link">
            <i class="fa-solid fa-file-invoice-dollar"></i> Invoices
          </Link>
          <Link to={"/dashboard/new-invoice"} className="menu-link">
            <i class="fa-solid fa-file-circle-plus"></i> New Invoice
          </Link>
          <Link to={"/dashboard/settings"} className="menu-link">
            <i class="fa-solid fa-gear"></i> Settings
          </Link>
          <div className="menu_logout">
          <button onClick={logout}>logout</button>
          </div>
        </div>
      </div>
      <div className="main_container">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
