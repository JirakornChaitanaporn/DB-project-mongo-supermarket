import React, { useState } from "react";

export function CreateCustomers() {
  const [first_name, setFName] = useState("");
  const [last_name, setLName] = useState("");
  const [phone_number, setPNum] = useState("");
  const [loyalty_point, setLPoint] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      firstname: first_name,
      lastname: last_name,
      phone_number: phone_number,
      loyalty_points: Number(loyalty_point),
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8002/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        alert("Customer created successfully!");
        setFName("");
        setLName("");
        setPNum("");
        setLPoint("");
      } else {
        const err = await response.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      alert("Failed to connect to server");
    }
  };

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "25px",
      color: "#333",
      textAlign: "center" as const,
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#555",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
      color: "#333",
      boxSizing: "border-box" as const,
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Customer</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>First Name:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLName(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number:</label>
          <input
            type="text"
            value={phone_number}
            onChange={(e) => setPNum(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Loyalty Points:</label>
          <input
            type="number"
            value={loyalty_point}
            onChange={(e) => setLPoint(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Create Customer
        </button>
      </form>
    </div>
  );
}
