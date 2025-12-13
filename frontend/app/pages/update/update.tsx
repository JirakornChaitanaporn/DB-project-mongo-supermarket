import "./update.css";
import bg0img from "../../assets/update/background.png";
import l0go from "../../assets/logo.png";

import DropdownButton from "../../component/dropdown/choose_button";
import { useState } from "react";

// import pages
import {} from "./tables/bill_items";
import {} from "./tables/bill";
import {} from "./tables/customers";
import {} from "./tables/employees";
import {} from "./tables/product_categories";
import { UpdateProduct } from "./tables/product";
import {} from "./tables/promotions";
import { EditRole } from "./tables/roles";
import {} from "./tables/suppliers";

export function UpdatePage() {

  const [currentPage, setCurrentPage] = useState("");

  const handlePageChange = (topic: string) => {
    setCurrentPage(topic); // updates state and triggers re-render
  };

  return (
    <div className="page-container">
      {/* Navigation Bar */}
      <nav className="global-top-navigation">
        <div className="margaintoleft-x4">
          <a href="/" className="text-nav">Home</a>
        </div>
      </nav>

      {/* The Whole Page */}
      <div className="main-container">
        <div className="main-background" style={{ backgroundImage: `url(${bg0img})` }}></div>

        {/* All Content in Here */}
        <div className="global-container">
          <div className="header-wrapper">
            <header className="header-x2">
              <a style={{ marginRight: "18px" }}>
                <img src={l0go} width="128" height="128" data-test="fandom-community-header-community-logo"></img>
              </a>
              <div className="header-text">
                DB-project-mongo-supermarket
              </div>
            </header>
          </div>
          <div className="page">
            <main className="page__main">
              <div className="page-header">
                <h1 className="head-text">Update : {currentPage}</h1>
              </div>

              <div className="bottom-gap">
                <DropdownButton
                  defaultLabel="Choose Topic"
                  options={["Bill_Item",
                            "Bill",
                            "Customer",
                            "Employee",                     
                            "Product_Categories",
                            "Product",
                            "Promotion",
                            "Role",
                            "Supplier"
                          ]}
                  onSelect={(topic) => handlePageChange(topic)} 
                />
              </div>

              <div className="bottom-gap">
                {/* Condition on currentPage */}
                {currentPage === "Bill_Item" && <p>Please choose a topic above.</p>}
                {currentPage === "Bill" && <p>Please choose a topic above.</p>}
                {currentPage === "Customer" && <p>Please choose a topic above.</p>}
                {currentPage === "Employee" && <p>Please choose a topic above.</p>}
                {currentPage === "Product_Categories" && <p>Please choose a topic above.</p>}
                {currentPage === "Product" && <p>Please choose a topic above.</p>}
                {currentPage === "Promotion" && <p>Please choose a topic above.</p>}
                {currentPage === "Role" && <EditRole />}
                {currentPage === "Supplier" && <p>Please choose a topic above.</p>}

                {/* None */}
                {currentPage === "" && <p>Please choose a topic above.</p>}
              </div>
            </main>
          </div>
        </div>

        {/* End Part */}
        <div className="global-footer">

        </div>
      </div>

    </div>
  );
}
