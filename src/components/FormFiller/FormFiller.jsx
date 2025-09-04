import { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ErrorAlert, FormSelector, FormFields, SubmitButton } from './formFillerBuilders';
import useRequireRole from "@/hooks/useRequireRole";
import AccessDeniedMessage from "@/components/common/AccessDenied";
import { getForms, getAccessibleForms } from "@/Services/formServices";

export default function FormFiller() {
  const navigate = useNavigate();
  const location = useLocation();

  const [savedForms, setSavedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formName, setFormName] = useState(location.state?.formName || "");
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    //formdata alustus localstoragesta, vaihtoehtoisesti navigation tilasta tai viimeisenä tyhjä objekti
    return saved ? JSON.parse(saved) : location.state?.formData || {};
  });
  const [error, setError] = useState(null);

  const { loading, accessDenied } = useRequireRole(["customer", "expert"]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    (async () => {
      try {
        const forms = await getAccessibleForms();
        setSavedForms(forms);
      } catch (err) {
        
        setError(`Käyttöoikeutettujen lomakkeiden haku epäonnistui: ${err.message || err.toString()}`);
      }
    })();
  }, []);

  useEffect(() => {
    // Tallennetaan aktiivisen lomakkeen tiedot localStorageen
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  //Päivitetään muokattavan lomakkeen tiedot, ...prev säilyttää edelliset tiedot
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
    
    // Tarkistetaan, onko pakolliset kentät täytetty ja ovatko numeroarvojen rajat oikein
    for (const field of selectedForm.fields) {
      const value = currentData[field.name];
      
      // Tarkistetaan, että pakollinen kenttä on täytetty
      if (field.mandatory) {
        const isFilled = typeof value === "string" ? value.trim() !== "" : value !== undefined && value !== null && value !== "";
        
        if (!isFilled) {
          setError(`Pakollinen kenttä "${field.name}" täytyy täyttää ennen lomakkeen lähettämistä.`);
          return;
        }
      }
      
      // Tarkistetaan numeroarvojen rajat
      if (field.type === "number" && (field.min !== undefined || field.max !== undefined)) {
        const numValue = Number(value);
        
        if (field.min !== undefined && numValue < field.min) {
          setError(`Kentän "${field.name}" arvon tulee olla vähintään ${field.min}.`);
          return;
        }
        
        if (field.max !== undefined && numValue > field.max) {
          setError(`Kentän "${field.name}" arvon tulee olla enintään ${field.max}.`);
          return;
        }
      }
    }

    //trimmaus, jos kentät sisältävät välilyönnit
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
  if (accessDenied) 
    return <AccessDeniedMessage message={error}/>;

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
