// formFillerBuilder.js
import { Form, Button, Alert } from "react-bootstrap";

// Virheilmoituskomponentti
export const ErrorAlert = ({ error }) => {
  if (!error) return null;
  return <Alert variant="danger">{error}</Alert>;
};

export const FormSelector = ({ savedForms, formName, onFormSelect }) => (
  
  <Form.Group className="mb-3">
    <Form.Label>Valitse tallennettu lomake</Form.Label>
    <Form.Select onChange={onFormSelect} >
    
      <option value="">
        Valitse lomake
      </option>
      {savedForms.map((form, index) => (
        <option key={index} value={form}>
          {form}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);


// Lomakkeen kenttien renderöinti
export const FormFields = ({ fields, formData, onFieldChange }) => (
  <>
    {fields.map((field, index) => (
      <Form.Group className="mb-3" key={index}>
        <Form.Label>{field.name}</Form.Label>
        {field.type === "boolean" ? (
          // muutetaan arvot boolean arvoon
          <Form.Select  
            value={formData[field.name] !== undefined ? formData[field.name] : ""}
            onChange={(e) => onFieldChange(field.name, e.target.value === "true")}
          >
            <option value="" disabled>Valitse</option>
            <option value="true">Kyllä</option>
            <option value="false">Ei</option>
          </Form.Select>
        ) : (
          field.type === "number" ? (
            // numero kentän arvo numeroksi, varmistetaan ettei muunnos epäonnistu
            <Form.Control
              type="number"
              value={formData[field.name] ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                //jos value on tyhjä, asetetaan num tyhjäksi, muuten muunnetaan numeroksi
                const num = value === "" ? "" : Number(value);
                // tarkistetaan, että num on kelvollinen numero, jos ei, asetetaan tyhjä
                onFieldChange(field.name, value === "" ? "" : (Number.isNaN(num) ? "" : num));
              }}
            />
          ) : (
            // tekstimuotoiset kentät 
            <Form.Control
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
            />
          )
        )}
      </Form.Group>
    ))}
  </>
);

// Lähetysbuttonin käsittely
export const SubmitButton = ({ onSubmit }) => (
  <Button onClick={onSubmit} type="submit">
    Lähetä
  </Button>
);
