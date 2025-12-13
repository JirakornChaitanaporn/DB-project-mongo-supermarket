import React, { useEffect } from "react";

type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number";
  required?: boolean;
};

type BlankPageProps = {
  show: boolean;
  title: string;
  fields: FieldConfig[];
  entity: any;
  onChange: (updated: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

function getValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function setValue(obj: any, path: string, value: any) {
  const parts = path.split(".");
  const last = parts.pop()!;
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
  return { ...obj };
}

export default function BlankPage({
  show,
  title,
  fields,
  entity,
  onChange,
  onSave,
  onCancel,
}: BlankPageProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 text-black"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded shadow-lg max-w-lg w-full relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">{title}</h1>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Form */}
        <div className="p-4 flex flex-col gap-4">
          {fields.map((field) => {
            const value = getValue(entity, field.key) || "";
            return (
              <label key={field.key} className="flex flex-col gap-1">
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    value={value}
                    onChange={(e) =>
                      onChange(setValue({ ...entity }, field.key, e.target.value))
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) =>
                      onChange(
                        setValue(
                          { ...entity },
                          field.key,
                          field.type === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                )}
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
