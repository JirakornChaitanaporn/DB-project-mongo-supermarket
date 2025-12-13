import "../layout.css"
import React, { useState, useEffect } from "react";
import type { Role } from "../../types/role";

type BlankPageProps = {
  show: boolean;
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
};

export default function BlankPage({ show, title, children, onCancel }: BlankPageProps) {

  // Load role data into form when modal opens
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
    {/* The Whole Page */}
      <div className="main-container">
        <div className="main-background" style={{ backgroundColor: "black"}}></div>

        {/* All Content in Here */}
        <div className="global-container">
          <div className="page">
            <main className="page__main">
              <div className="page-header">
                <h1 className="head-text">Edit :</h1>
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
