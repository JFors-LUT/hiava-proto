import { useState, useEffect } from "react";

export default function FormFiller() {
  const [fields, setFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const storedFields = JSON.parse(localStorage.getItem("formFields"));
    if (storedFields) {
      setFields(storedFields);
      const initialValues = storedFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {});
      setFormValues(initialValues);
    }
  }, []);

  const handleChange = (e, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues); // Lomakkeen arvot
  };

  const renderFieldInput = (field) => {
    switch (field.type) {
      case "string":
        return (
          <input
            type="text"
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(e, field.name)}
            className="border rounded p-2 flex-1"
            placeholder={`Syötä ${field.name}`}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={formValues[field.name] || ""}
            onChange={(e) => handleChange(e, field.name)}
            className="border rounded p-2 flex-1"
            placeholder={`Syötä ${field.name}`}
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={formValues[field.name] || false}
            onChange={(e) => handleChange(e, field.name)}
            className="border rounded p-2"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Täytä lomake</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <label className="flex-1">{field.name}</label>
            {renderFieldInput(field)}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 mt-4"
        >
          Lähetä
        </button>
      </form>
    </div>
  );
}
