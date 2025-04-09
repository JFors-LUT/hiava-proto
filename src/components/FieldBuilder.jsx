import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Muutettu useHistory -> useNavigate

export default function FieldBuilder() {
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ name: "", type: "string" });
  const [formValues, setFormValues] = useState({});

  const navigate = useNavigate(); // Käytetään siirtymistä toiseen näkymään

  // Lisää kenttä
  const addField = () => {
    if (!newField.name) return;

    // Tarkistetaan, että kentän nimi ei ole jo olemassa
    if (fields.some((field) => field.name === newField.name)) {
      alert("Kenttä nimeltä '" + newField.name + "' on jo olemassa.");
      return;
    }

    setFields([...fields, newField]);
    setFormValues({ ...formValues, [newField.name]: "" });
    setNewField({ name: "", type: "string" });
  };

  // Poista kenttä
  const removeField = (fieldName) => {
    setFields(fields.filter((field) => field.name !== fieldName));
    const newFormValues = { ...formValues };
    delete newFormValues[fieldName];
    setFormValues(newFormValues);
  };

  // Luo lomake ja siirry lomakkeen täyttämisnäkymään
  const createForm = () => {
    // Tallennetaan kentät ja siirretään lomakkeen täyttämisnäkymään
    localStorage.setItem("formFields", JSON.stringify(fields));
    navigate("/fill-form"); // Käytetään navigate() siirtymiseen
  };

  // Kenttämuutokset
  const handleFieldChange = (e, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: e.target.value });
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Lisää kenttä</h2>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Kentän nimi"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          className="border rounded p-2 flex-1"
        />
        <select
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
          className="border rounded p-2"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
        <button
          onClick={addField}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lisää
        </button>
      </div>

      <div>
        <h3 className="font-semibold mt-4">Kentät</h3>
        {fields.length === 0 && <p>Ei kenttiä lisätty.</p>}
        <ul className="list-disc pl-5 space-y-1">
          {fields.map((field, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span>
                <strong>{field.name}</strong> ({field.type})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => removeField(field.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  Poista
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={createForm}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 mt-4"
      >
        Luo lomake
      </button>
    </div>
  );
}
