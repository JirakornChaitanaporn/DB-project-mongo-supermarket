import React, { Suspense, useState } from "react";
import DropdownButton from "../../component/dropdown/choose_button";
import "./create.css";
import bg0img from "../../assets/create/background.png";
import l0go from "../../assets/logo.png";

// Lazy imports
const ReadBillItems = React.lazy(() => import("./tables/bill_items"));
const ReadBill = React.lazy(() => import("./tables/bill"));
const ReadCustomers = React.lazy(() => import("./tables/customers"));
const ReadEmployees = React.lazy(() => import("./tables/employees"));
const ReadProductCategories = React.lazy(() => import("./tables/product_categories"));
const ReadProduct = React.lazy(() => import("./tables/product"));
const ReadPromotions = React.lazy(() => import("./tables/promotions"));
const ReadRoles = React.lazy(() => import("./tables/roles"));
const ReadSuppliers = React.lazy(() => import("./tables/suppliers"));

export function CreatePage() {
  const pageComponents: Record<string, React.ComponentType<any>> = {
  Bill_Item: ReadBillItems,
  Bill: ReadBill,
  Customer: ReadCustomers,
  Employee: ReadEmployees,
  Product_Categories: ReadProductCategories,
  Product: ReadProduct,
  Promotion: ReadPromotions,
  Role: ReadRoles,
  Supplier: ReadSuppliers,
  };

  const [currentPage, setCurrentPage] = useState("");

  return (
    <div className="page-container">
      <nav className="global-top-navigation">
        <div className="margaintoleft-x4">
          <a href="/" className="text-nav">Home</a>
        </div>
      </nav>

      <div className="main-container">
        <div className="main-background" style={{ backgroundImage: `url(${bg0img})` }}></div>

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
                <h1 className="head-text">Create : {currentPage}</h1>
              </div>

              <div className="bottom-gap">
                <DropdownButton
                  defaultLabel="Choose Topic"
                  options={Object.keys(pageComponents)}
                  onSelect={(topic) => setCurrentPage(topic)}
                />
              </div>

              <div className="bottom-gap">
                <Suspense fallback={<p>Loading table...</p>}>
                  {(() => {
                    const Page = pageComponents[currentPage];
                    return Page ? <Page /> : <p>Please choose a topic above.</p>;
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
