// FormFiller.jsx
import { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function FormFiller() {
  const [savedForms, setSavedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [formName, setFormName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem("savedForms")) || [];
    setSavedForms(forms);
  }, []);

  const handleFormSelect = (e) => {
    const selected = savedForms.find(form => form.name === e.target.value);
    setSelectedForm(selected);
    setFormName(selected.name); // Päivitetään lomakkeen nimi
    setFormData({});
  };

  const handleChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = () => {
    // Ohjataan käyttäjä ConfirmSubmission-sivulle, ja välitetään tiedot mukana
    navigate("/confirm", { state: { formData, formName } });
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h3 className="mb-3">Täytä lomake</h3>

          <Form.Group className="mb-3">
            <Form.Label>Valitse tallennettu lomake</Form.Label>
            <Form.Select onChange={handleFormSelect} defaultValue="">
              <option value="" disabled>
                Valitse lomake
              </option>
              {savedForms.map((form, index) => (
                <option key={index} value={form.name}>
                  {form.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedForm && (
            <Form onSubmit={(e) => e.preventDefault()}>
              {selectedForm.fields.map((field, index) => (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>{field.name}</Form.Label>

                  {/* Muutetaan Boolean kenttä DropDown-valikoksi */}
                  {field.type === "boolean" ? (
                    <Form.Select
                      value={formData[field.name] !== undefined ? formData[field.name] : ""}
                      onChange={(e) => handleChange(field.name, e.target.value === "true")}
                    >
                      <option value="" disabled>Valitse</option>
                      <option value="true">Kyllä</option>
                      <option value="false">Ei</option>
                    </Form.Select>
                  ) : (
                    <Form.Control
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                    />
                  )}
                </Form.Group>
              ))}
              <Button onClick={handleSubmit} type="submit">
                Lähetä
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
