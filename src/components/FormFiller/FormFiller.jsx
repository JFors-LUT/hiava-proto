import { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate, useLocation  } from "react-router-dom";
import { ErrorAlert, FormSelector, FormFields, SubmitButton } from './formFillerBuilders';
import useRequireRole from "@/hooks/useRequireRole";
import AccessDeniedMessage from "@/components/common/AccessDenied";
import { getForms } from "@/Services/formServices";

export default function FormFiller() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tilan määrittely
  const [savedForms, setSavedForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formName, setFormName] = useState(location.state?.formName || "");
  const [formData, setFormData] = useState(location.state?.formData || {});
  const [error, setError] = useState(null);

  // Käytetään useRequireRole hookkia hyväksyttyjen roolien tarkistamiseen
  const { loading, accessDenied } = useRequireRole(["customer", "expert"]);

  // Käytetään localStoragea roolin hakemiseen
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole) {
      let forms = [];

      if (userRole === "expert") {
        forms = ["Asiakaspalaute", "Kysely"];
      } else if (userRole === "customer") {
        forms = ["Asiakaspalaute"];
      }

      setSavedForms(forms);
      setFormName(forms[0] || "");  // Asetetaan ensimmäinen lomake valituksi, jos lomakkeita on
    }
  }, [userRole]);  // Tämä efekti ajetaan aina, kun käyttäjän rooli muuttuu

  // Lomakkeen kentän muutos
  const handleChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = () => {
    // Tarkistetaan, että kaikki kentät on täytetty
    const allFieldsFilled = selectedForm.fields.every((field) => {
      return formData[field.label] !== undefined && formData[field.label] !== "";
    });

    if (!allFieldsFilled) {
      setError("Kaikki kentät täytyy täyttää ennen lomakkeen lähettämistä.");
      return;
    }

    setError(null);
    navigate("/confirm", { state: { formData, formName } });
  };

  // Estetään pääsy, jos käyttäjä ei ole oikeutettu
  if (loading) return <p>Ladataan...</p>;
  if (accessDenied) return <AccessDeniedMessage />;

  // Haetaan valittu lomake
  const handleFormSelect = async (e) => {
    const formName = e.target.value;
    //setFormName(formName);

    try {
      // Lähetetään pyyntö serverille, jossa haetaan vain valittu lomake
      const form = await getForms(formName);  // getForms on edellä määritelty funktio
      setSelectedForm(form);
    } catch (err) {
      setError("Lomakkeen haku epäonnistui");
    }
  };

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
              <FormFields fields={selectedForm.fields} formData={formData} onFieldChange={handleChange} />
              <SubmitButton onSubmit={handleSubmit} />
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
