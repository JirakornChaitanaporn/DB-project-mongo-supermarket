import "./home.css";
import bg0img from "../../assets/background.png";
import l0go from "../../assets/logo.png";

// import CRUD images
import create_icon from "../../assets/crud/create.png";
import read_icon from "../../assets/crud/read.png";
import update_icon from "../../assets/crud/update.png";
import delete_icon from "../../assets/crud/delete.png";

import { Link } from "react-router";

export function HomePage() {

  const crudItems = [
    { label: "Create", icon: create_icon },
    { label: "Read", icon: read_icon },
    { label: "Update", icon: update_icon },
    { label: "Delete", icon: delete_icon },
    { label: "Query", icon: read_icon },
  ];


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
                <img src={l0go} width="128" height="128" title="DB_Logo"></img>
              </a>
              <div className="header-text">
                DB-project-mongo-supermarket
              </div>
            </header>
          </div>

          <div className="page">
            <main className="page__main">
              <div className="page-header">
                <h1 className="head-text">Choosw</h1>
              </div>

              <div className="griddy-2-cols">
                {crudItems.map(({ label, icon }) => (
                  <div key={label}>
                    <div className="homepage-nav__button">
                      <a href={label.toLowerCase()}>
                        <img src={icon} width="192" height="192" title={`CRUD_${label.toLowerCase()}`}></img>
                      </a>
                    </div>
                    <Link to={label.toLowerCase()} className="homepage-nav__underbutton">
                      {label}
                    </Link>
                  </div>
                ))}
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



