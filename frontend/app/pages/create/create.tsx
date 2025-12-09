import "./create.css";
import bg0img from "../../assets/create/background.png";
import l0go from "../../assets/logo.png";

import DropdownButton from "../../component/dropdown/choose_button";
import { useState } from "react";

// import pages
import {} from "./tables/bill_items"
import {} from "./tables/bill"
import { CreateCustomers } from "./tables/customers"
import { CreateEmployees } from "./tables/employees"
import {} from "./tables/product_categories"
import { CreateProduct } from "./tables/product";
import {} from "./tables/promotions"
import { CreateRoles } from "./tables/roles"
import {} from "./tables/suppliers"

export function CreatePage() {

  const [currentPage, setCurrentPage] = useState("");

  const handlePageChange = (topic: string) => {
    setCurrentPage(topic); // updates state and triggers re-render
  };

  return (
    <div className="page-container">
      {/* Navigation Bar */}
      <nav className="global-top-navigation">
        <div className="margaintoleft-x4">
          <a href="/" className="text-nav">
            Home
          </a>
        </div>
      </nav>

      {/* The Whole Page */}
      <div className="main-container">
        <div
          className="main-background"
          style={{ backgroundImage: `url(${bg0img})` }}
        ></div>

        {/* All Content in Here */}
        <div className="global-container">
          <div className="header-wrapper">
            <header className="header-x2">
              <a style={{ marginRight: "18px" }}>
                <img
                  src={l0go}
                  width="128"
                  height="128"
                  data-test="fandom-community-header-community-logo"
                ></img>
              </a>
              <div className="header-text">DB-project-mongo-supermarket</div>
            </header>
          </div>
          <div className="page">
            <main className="page__main">
              <div className="page-header">
                <h1 className="head-text">Read : {currentPage}</h1>
              </div>

              <div className="bottom-gap">
                <DropdownButton
                  defaultLabel="Choose Topic"
                  options={[
                    "Product",
                    "Product_Categories",
                    "Dont click this Nigga",
                    "Customer",
                    "Role",
                    "Employee",
                  ]}
                  onSelect={(topic) => handlePageChange(topic)}
                />
              </div>

              <div className="bottom-gap">
                {/* Condition on currentPage */}

                {currentPage === "Customer" && <CreateCustomers />}
                {currentPage === "Role" && <CreateRoles />}
                {currentPage === "Employee" && <CreateEmployees />}
                {currentPage === "Product" && <CreateProduct />}
                {currentPage === "Product_Categories" && <p>Place?holder</p>}
                {/* None */}
                {currentPage === "" && <p>Please choose a topic above.</p>}
              </div>
            </main>
          </div>
        </div>

        {/* End Part */}
        <div className="global-footer"></div>
      </div>
    </div>
  );
}
