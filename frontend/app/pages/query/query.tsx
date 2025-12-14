import "./query.css";
import bg0img from "../../assets/read/background.png";
import l0go from "../../assets/logo.png";
import { useState } from "react";
import { domain_link } from "../domain";

// Define Query Definitions
interface InputDef {
    name: string;
    label: string;
    type: string; // text, number, date
    placeholder?: string;
}

interface QueryDef {
    id: number;
    name: string;
    description: string;
    inputs: InputDef[];
    endpoint: (params: Record<string, string>) => string;
}

const QUERIES: QueryDef[] = [
    {
        id: 1,
        name: "1. Fetch Customer by Phone",
        description: "Fetch customer details using their phone number.",
        inputs: [{ name: "phone_number", label: "Phone Number", type: "text", placeholder: "e.g. 0812345678" }],
        endpoint: (p) => `api/customer/fetchByPhoneNumber/${p.phone_number}`
    },
    {
        id: 2,
        name: "2. Fetch Product by Name",
        description: "Search for products by name.",
        inputs: [{ name: "pName", label: "Product Name", type: "text", placeholder: "e.g. Vegetable" }],
        endpoint: (p) => `api/product/fetchProductByName/${p.pName}`
    },
    {
        id: 3,
        name: "3. Total Spend by Customer",
        description: "Get total amount spent by a customer.",
        inputs: [{ name: "phone_number", label: "Phone Number", type: "text" }],
        endpoint: (p) => `api/customer/fetchTotalSpendByPhoneNumber/${p.phone_number}`
    },
    {
        id: 4,
        name: "4. Low Quantity Products in Category",
        description: "Find products with low quantity in a specific category.",
        inputs: [
            { name: "amount", label: "Maximum Quantity", type: "number" },
            { name: "name", label: "Category Name", type: "text" }
        ],
        endpoint: (p) => `api/product/fetchIsLowQuantity/${p.amount}/${p.name}`
    },
    {
        id: 5,
        name: "5. Supplier & Products",
        description: "Fetch supplier and their product catalog.",
        inputs: [{ name: "sName", label: "Supplier Name", type: "text" }],
        endpoint: (p) => `api/supplier/fetchSupplierProduct/${p.sName}`
    },
    {
        id: 6,
        name: "6. Promotions on Date",
        description: "Find promotions active on a specific date.",
        inputs: [{ name: "date", label: "Date", type: "date" }],
        endpoint: (p) => `api/promotion/fetchPromotionToday/${p.date}`
    },
    {
        id: 7,
        name: "7. Total Bill Sum by Date Range",
        description: "Calculate total revenue within a date range.",
        inputs: [
            { name: "start_date", label: "Start Date", type: "date" },
            { name: "end_date", label: "End Date", type: "date" }
        ],
        endpoint: (p) => `api/bill/fetchByDateRange/${p.start_date}/${p.end_date}`
    },
    {
        id: 8,
        name: "8. Best Selling Items",
        description: "Get the top best selling items.",
        inputs: [{ name: "limit", label: "Limit", type: "number", placeholder: "e.g. 5" }],
        endpoint: (p) => `api/billitem/fetchBestSellingItem/${p.limit}`
    },
    {
        id: 9,
        name: "9. Employee Rank by Sales",
        description: "Rank employees by total sales within a date range.",
        inputs: [
            { name: "start_date", label: "Start Date", type: "date" },
            { name: "end_date", label: "End Date", type: "date" }
        ],
        endpoint: (p) => `api/employee/fetchRankEmployee/${p.start_date}/${p.end_date}`
    }
];

export function QueryPage() {
    const [selectedQueryId, setSelectedQueryId] = useState<number | string>("");
    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleQueryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedQueryId(id);
        setInputValues({});
        setResult(null);
        setError("");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        setInputValues(prev => ({ ...prev, [fieldName]: e.target.value }));
    };

    const runQuery = async () => {
        const queryDef = QUERIES.find(q => q.id === selectedQueryId);
        if (!queryDef) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const url = `${domain_link}${queryDef.endpoint(inputValues)}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errJson = await response.json();
                throw new Error(errJson.error || errJson.message || `Error: ${response.statusText}`);
            }
            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    // Helper to render table
    const renderTable = (data: any) => {
        if (!data) return null;

        let rows = [];
        if (Array.isArray(data)) {
            rows = data;
        } else if (typeof data === 'object') {
            rows = [data]; // Wrap single object in array
        } else {
            return <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>;
        }

        if (rows.length === 0) return <p>No results found.</p>;

        // Get headers from the first object keys
        // We'll traverse nested objects to flat them or just show as JSON string for now if complex
        const headers = Object.keys(rows[0]);

        return (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black', background: 'white' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        {headers.map(header => (
                            <th key={header} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', textTransform: 'capitalize' }}>
                                {header.replace(/_/g, ' ')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                            {headers.map(header => {
                                const cellValue = row[header];
                                const displayValue = typeof cellValue === 'object' && cellValue !== null
                                    ? JSON.stringify(cellValue)
                                    : String(cellValue);

                                return (
                                    <td key={`${idx}-${header}`} style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {displayValue}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const selectedQuery = QUERIES.find(q => q.id === selectedQueryId);

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
                                    <label htmlFor="querySelect" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', display: 'block', marginBottom: '10px' }}>
                                        Select Query:
                                    </label>
                                    <select
                                        id="querySelect"
                                        className="query-select"
                                        value={selectedQueryId}
                                        onChange={handleQueryChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '20px', color: 'black', background: 'white' }}
                                    >
                                        <option value="">-- Choose a Query --</option>
                                        {QUERIES.map(q => (
                                            <option key={q.id} value={q.id}>{q.name}</option>
                                        ))}
                                    </select>

                                    {selectedQuery && (
                                        <div className="query-params" style={{ color: 'white', marginBottom: '20px' }}>
                                            <p style={{ marginBottom: '15px' }}>{selectedQuery.description}</p>
                                            <div style={{ display: 'grid', gap: '15px' }}>
                                                {selectedQuery.inputs.map(input => (
                                                    <div key={input.name}>
                                                        <label style={{ display: 'block', marginBottom: '5px' }}>{input.label}:</label>
                                                        <input
                                                            type={input.type}
                                                            placeholder={input.placeholder}
                                                            className="query-input"
                                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'white', color: 'black' }}
                                                            value={inputValues[input.name] || ""}
                                                            onChange={(e) => handleInputChange(e, input.name)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                className="query-run-button"
                                                onClick={runQuery}
                                                disabled={loading}
                                                style={{ marginTop: '20px', padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer' }}
                                            >
                                                {loading ? "Running..." : "Run Query"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ color: 'white', marginTop: '30px' }}>
                                    <h2>Results:</h2>
                                    {error && (
                                        <div style={{ background: 'rgba(255,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '10px', color: '#ffcccc' }}>
                                            Error: {error}
                                        </div>
                                    )}
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', minHeight: '100px', overflowX: 'auto' }}>
                                        {result ? (
                                            renderTable(result)
                                        ) : (
                                            <p style={{ color: '#ccc', fontStyle: 'italic' }}>
                                                {loading ? "Fetching data..." : "Results will appear here..."}
                                            </p>
                                        )}
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
