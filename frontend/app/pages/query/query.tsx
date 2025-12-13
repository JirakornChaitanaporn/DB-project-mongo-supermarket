import "./query.css";
// Aligning with "Read" page look, using the same background if available or fallback
import bg0img from "../../assets/read/background.png";
import l0go from "../../assets/logo.png";
import { useState } from "react";
import DropdownButton from "../../component/dropdown/choose_button";

export function QueryPage() {
    const [selectedTopic, setSelectedTopic] = useState("");
    const [queryParam, setQueryParam] = useState("");
    const [queryResult, setQueryResult] = useState<string | null>(null);

    const handleTopicChange = (topic: string) => {
        setSelectedTopic(topic);
        setQueryParam("");
        setQueryResult(null);
    };

    const handleRunQuery = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock functionality for now
        setQueryResult(`Mock result for ${selectedTopic} with parameter: "${queryParam}"`);
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
                                <DropdownButton
                                    defaultLabel="Choose Query Topic"
                                    options={[
                                        "Bill_Item",
                                        "Bill",
                                        "Customer",
                                        "Employee",
                                        "Product_Categories",
                                        "Product",
                                        "Promotion",
                                        "Role",
                                        "Supplier",
                                    ]}
                                    onSelect={(topic) => handleTopicChange(topic)}
                                />
                            </div>

                            {selectedTopic ? (
                                <div className="query-section" style={{ marginTop: '20px', color: 'white' }}>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Querying: {selectedTopic}</h2>

                                    <form onSubmit={handleRunQuery} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <label htmlFor="queryParam" style={{ fontWeight: 'bold' }}>Parameter:</label>
                                        <input
                                            id="queryParam"
                                            type="text"
                                            value={queryParam}
                                            onChange={(e) => setQueryParam(e.target.value)}
                                            placeholder={`Enter ${selectedTopic} parameter...`}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                color: 'black',
                                                minWidth: '300px'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '4px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Run Query
                                        </button>
                                    </form>

                                    {queryResult && (
                                        <div className="results-section" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                            <h3 style={{ marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px' }}>Results:</h3>
                                            <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                                {queryResult}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#fff', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', marginTop: '20px' }}>
                                    <h2>Select a topic above to start querying</h2>
                                </div>
                            )}
                        </main>
                    </div>
                </div>

                {/* End Part */}
                <div className="global-footer"></div>
            </div>
        </div>
    );
}
