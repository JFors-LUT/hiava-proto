import { useLocation, useNavigate  } from "react-router-dom";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_BASE_URL; //Ympäristömuuttuja serverin osoitteeksi

export default function ConfirmSubmission() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, formName } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  // Seurataan onko lomake lähetetty
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true); // Hallitaan "Takaisin"-napin näkyvyyttä

  const handleSubmit = () => {
    setIsSubmitting(true);
    setIsBackButtonVisible(false);  // Piilotetaan Takaisin-nappi lähetyksen jälkeen

    // Lähetetään lomakkeen tiedot POST-pyynnöllä
    fetch(`${API_BASE}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ formName, formData })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Lomake lähetetty onnistuneesti:", data);
      setIsSubmitted(true);  // Asetetaan lomake lähetetyksi
    })
    .catch(error => {
      console.error("Virhe lomakkeen lähettämisessä:", error);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleBack = () => {
    // Palaa takaisin FormFiller näkymään ja täyttää aiemmin syötetyt tiedot
    navigate("/fill-form", { state: { formData, formName } });
  };

  if (!formData || !formName) {
    return <div>No data available.</div>;
  }

  return (
    <div className="container mt-5">
      <Card className="mt-3">
        <Card.Body>
          <h3>{formName}</h3>
          <ul>
            {Object.keys(formData).map((key, index) => (
              <li key={index}>
                <strong>{key}:</strong> {formData[key].toString()}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body className="d-flex justify-content-between">
          {/* Vasemmanpuoleinen Takaisin-nappi, piilotetaan kun lomake on lähetetty */}
          {isBackButtonVisible && (
            <div>
              <Button variant="outline-secondary" onClick={handleBack}>
                Takaisin
              </Button>
            </div>
          )}

          {/* Oikeanpuoleinen Lähetä lomake -nappi */}
          <div className="text-end">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Lähetetään..." : "Lähetä lomake"}
              </Button>
            ) : (
              <span style={{ color: 'green', fontWeight: 'bold' }}>Lomake lähetetty</span>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
