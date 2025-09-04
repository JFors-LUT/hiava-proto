import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { submitForm } from "@/Services/formServices";

export default function ConfirmSubmission() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, formName } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitForm({ formName, formData }); // formData = { Asiakaspalaute: { ... } }
      setIsSubmitted(true);
      setIsBackButtonVisible(false);
      if (!response) {
        throw new Error("Lähetys epäonnistui. Yritä uudelleen.");
      }
      
    } catch (error) {
      setError(error);
    } finally {
      
      setIsSubmitting(false);
    }
    
  };

  const handleBack = () => {
    navigate("/fill-form", { state: { formData, formName } });
  };

  if (!formData || !formName) {
    return <div>No data available.</div>;
  }

  const currentFormData = formData[formName] || {};

  return (
    <div className="container mt-5">
      <Card className="mt-3">
        <Card.Body>
          <h3>{formName}</h3>
          <i>Tarkista, että antamasi lomakkeen tiedot ovat oikein. Jos huomaat virheen, muokkaa tietoja painamalla "Takaisin" ja valitsemalla kyseinen lomake uudelleen.</i>
          <ul>
            {Object.entries(currentFormData).map(([key, value], index) => (
              <li key={index}>
                <strong>{key}:</strong> {value?.toString() || ""}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="d-flex justify-content-between">
          {isBackButtonVisible && (
            <Button variant="outline-secondary" onClick={handleBack}>
              Takaisin
            </Button>
          )}
          <div className="text-end">
            {!isSubmitted ? (
              <>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Lähetetään..." : "Lähetä lomake"}
                </Button>

                {error !== null && (
                  <p style={{ color: "red", fontWeight: "bold", marginTop: "0.5rem" }}>
                    {error.message}
                  </p>
                )}
              </>
            ) : (
              <span style={{ color: "green", fontWeight: "bold" }}>
                Lomake lähetetty
              </span>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
