import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";

export default function ConfirmSubmission() {
  const location = useLocation();
  const { formData, formName } = location.state || {};

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const submissionData = {
      formName,
      fields: formData,
    };

    console.log(JSON.stringify(submissionData, null, 2));
    setSubmitted(true);
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h3 className="mb-4">Tarkista tiedot ennen lähettämistä</h3>
          <h5>{formName}</h5>

          {formData && (
            <div className="mb-3">
              <ul>
                {Object.entries(formData).map(([key, value], index) => (
                  <li key={index}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "boolean" ? (value ? "Kyllä" : "Ei") : value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!submitted ? (
            <Button variant="success" onClick={handleSubmit}>
              Lähetä
            </Button>
          ) : (
            <div className="text-success fw-bold">Tiedot lähetetty</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
