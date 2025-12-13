import "./query.css";
// Aligning with "Read" page look, using the same background if available or fallback
import bg0img from "../../assets/read/background.png";
import l0go from "../../assets/logo.png";
import { useState } from "react";

export function QueryPage() {
    const [query, setQuery] = useState("");

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
                                    alt="DB Logo"
                                ></img>
                            </a>
                            <div className="header-text">DB-project-mongo-supermarket</div>
                        </header>
                    </div>
                    <div className="page">
                        <main className="page__main">
                            <div className="page-header">
                                <h1 className="head-text">Query Interface</h1>
                            </div>

                            <div className="bottom-gap">
                                <div className="query-input-container">
                                    <label htmlFor="queryInput" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                                        Enter your query:
                                    </label>
                                    <textarea
                                        id="queryInput"
                                        className="query-textarea"
                                        placeholder="Type your query here..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <button className="query-run-button">
                                        Run Query
                                    </button>
                                </div>

                                <div style={{ color: 'white' }}>
                                    <h2>Results:</h2>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', minHeight: '100px' }}>
                                        <p style={{ color: '#ccc', fontStyle: 'italic' }}>Results will appear here...</p>
                                    </div>
                                </div>
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
