import React, { Suspense, useState } from "react";
import "./delmove.css";
import bg0img from "../../assets/delmove/background.png";
import l0go from "../../assets/logo.png";

import DropdownButton from "../../component/dropdown/choose_button";

// Lazy imports (same pattern as ReadPage)
const DeleteBillItem = React.lazy(() => import("./tables/bill_items"));
const DeleteBill = React.lazy(() => import("./tables/bill"));
const DeleteCustomer = React.lazy(() => import("./tables/customers"));
const DeleteEmployee = React.lazy(() => import("./tables/employees"));
const DeleteCategory = React.lazy(() => import("./tables/product_categories"));
const DeleteProduct = React.lazy(() => import("./tables/product"));
const DeletePromotion = React.lazy(() => import("./tables/promotions"));
const DeleteRole = React.lazy(() => import("./tables/roles"));
const DeleteSupplier = React.lazy(() => import("./tables/suppliers"));

export function DelmovePage() {
  const pageComponents: Record<string, React.ComponentType<any>> = {
    Bill_Item: DeleteBillItem,
    Bill: DeleteBill,
    Customer: DeleteCustomer,
    Employee: DeleteEmployee,
    Product_Categories: DeleteCategory,
    Product: DeleteProduct,
    Promotion: DeletePromotion,
    Role: DeleteRole,
    Supplier: DeleteSupplier,
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
                <h1 className="head-text">Delete : {currentPage}</h1>
              </div>

              <div className="bottom-gap">
                <DropdownButton
                  defaultLabel="Choose Topic"
                  options={Object.keys(pageComponents)}
                  onSelect={(topic) => setCurrentPage(topic)}
                />
              </div>

              <div className="bottom-gap">
                <Suspense fallback={<p>Loading delete table...</p>}>
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
