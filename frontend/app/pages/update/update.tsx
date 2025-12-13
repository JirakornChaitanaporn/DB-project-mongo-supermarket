import React, { Suspense, useState } from "react";
import "./update.css";
import bg0img from "../../assets/update/background.png";
import l0go from "../../assets/logo.png";

import DropdownButton from "../../component/dropdown/choose_button";

// Lazy imports (same pattern as read.tsx)
const EditBillItem = React.lazy(() => import("./tables/bill_items"));
const EditBill = React.lazy(() => import("./tables/bill"));
const EditCustomer = React.lazy(() => import("./tables/customers"));
const EditEmployee = React.lazy(() => import("./tables/employees"));
const EditCategory = React.lazy(() => import("./tables/product_categories"));
const EditProduct = React.lazy(() => import("./tables/product"));
const EditPromotion = React.lazy(() => import("./tables/promotions"));
const EditRole = React.lazy(() => import("./tables/roles"));
const EditSupplier = React.lazy(() => import("./tables/suppliers"));

export function UpdatePage() {
  const pageComponents: Record<string, React.ComponentType<any>> = {
    Bill_Item: EditBillItem,
    Bill: EditBill,
    Customer: EditCustomer,
    Employee: EditEmployee,
    Product_Categories: EditCategory,
    Product: EditProduct,
    Promotion: EditPromotion,
    Role: EditRole,
    Supplier: EditSupplier,
  };

  const [currentPage, setCurrentPage] = useState("");

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

      <div className="main-container">
        <div
          className="main-background"
          style={{ backgroundImage: `url(${bg0img})` }}
        ></div>

        <div className="global-container">
          <div className="header-wrapper">
            <header className="header-x2">
              <a style={{ marginRight: "18px" }}>
                <img src={l0go} width="128" height="128" alt="logo" />
              </a>
              <div className="header-text">DB-project-mongo-supermarket</div>
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
                  options={Object.keys(pageComponents)}
                  onSelect={(topic) => setCurrentPage(topic)}
                />
              </div>

              <div className="bottom-gap">
                <Suspense fallback={<p>Loading update page...</p>}>
                  {(() => {
                    const Page = pageComponents[currentPage];
                    return Page ? (
                      <Page />
                    ) : (
                      <p>Please choose a topic above.</p>
                    );
                  })()}
                </Suspense>
              </div>
            </main>
          </div>
        </div>

        <div className="global-footer"></div>
      </div>
    </div>
  );
}
