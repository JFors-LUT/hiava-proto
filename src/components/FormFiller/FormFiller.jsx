import { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ErrorAlert, FormSelector, FormFields, SubmitButton } from './formFillerBuilders';
import useRequireRole from "@/hooks/useRequireRole";
import AccessDeniedMessage from "@/components/common/AccessDenied";
import { getForms } from "@/Services/formServices";

export default function FormFiller() {
  const navigate = useNavigate();
  const location = useLocation();

  const [savedForms, setSavedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formName, setFormName] = useState(location.state?.formName || "");
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : location.state?.formData || {};
  });
  const [error, setError] = useState(null);

  const { loading, accessDenied } = useRequireRole(["customer", "expert"]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole) {
      let forms = [];

      if (userRole === "expert") {
        forms = ["Asiakaspalaute", "Kysely", "Test form 3"];
      } else if (userRole === "customer") {
        forms = ["Asiakaspalaute", "Test form 3"];
      }

      setSavedForms(forms);
    }
  }, [userRole]);

  useEffect(() => {
    // Tallennetaan aktiivisen lomakkeen tiedot localStorageen
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [formName]: {
        ...(prev[formName] || {}),
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = () => {
    const currentData = formData[formName] || {};

    const allFieldsFilled = selectedForm.fields.every((field) => {
      const value = currentData[field.label];
      return typeof value === "string" ? value.trim() !== "" : value !== undefined && value !== null && value !== "";
    });

    if (!allFieldsFilled) {
      setError("Kaikki kentät täytyy täyttää ennen lomakkeen lähettämistä.");
      return;
    }

    const trimmedData = {};
    for (const key in currentData) {
      const value = currentData[key];
      trimmedData[key] = typeof value === "string" ? value.trim() : value;
    }

    setError(null);
    navigate("/confirm", {
      state: {
        formData: { [formName]: trimmedData },
        formName
      }
    });
  };

  const handleFormSelect = async (e) => {
    const selected = e.target.value;
    setFormName(selected);

    try {
      const form = await getForms(selected);
      setSelectedForm(form);
    } catch (err) {
      setError("Lomakkeen haku epäonnistui");
    }
  };

  if (loading) return <p>Ladataan...</p>;
  if (accessDenied) return <AccessDeniedMessage />;

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h3 className="mb-3">Täytä lomake</h3>

          <ErrorAlert error={error} />

          <FormSelector
            savedForms={savedForms}
            formName={formName}
            onFormSelect={handleFormSelect}
          />

          {selectedForm && (
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormFields
                fields={selectedForm.fields}
                formData={formData[formName] || {}}
                onFieldChange={handleChange}
              />
              <SubmitButton onSubmit={handleSubmit} />
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
