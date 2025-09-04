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


// Lomakkeen kenttien renderöinti, mandatory kentät merkitty tähdellä
export const FormFields = ({ fields, formData, onFieldChange }) => (
  <>
    {fields.map((field, index) => (
      <Form.Group className="mb-3" key={index}>
        <Form.Label>
          {field.name}
          {field.mandatory && <span className="text-danger ms-1">*</span>}
        </Form.Label>
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
            // muunnetaan number tyyppi kentän arvo numeroksi, varmistetaan ettei muunnos epäonnistu
            <Form.Control
              type="number"
              value={formData[field.name] ?? ""}
              //numero kenttien minimi ja maksimi arvot, tarkista ja esitä käyttäjälle
              min={field.min}
              max={field.max}
              placeholder={
                field.min !== undefined && field.max !== undefined 
                  ? `${field.min} - ${field.max}`
                  : field.min !== undefined 
                    ? `Min: ${field.min}`
                    : field.max !== undefined 
                      ? `Max: ${field.max}`
                      : ""
              }
              onChange={(e) => {
                const raw = e.target.value;
                const num = raw === "" ? "" : Number(raw);
                onFieldChange(field.name, raw === "" ? "" : (Number.isNaN(num) ? "" : num));
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
