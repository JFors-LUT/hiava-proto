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
        <Form.Label>{field.label}</Form.Label>
        {field.type === "boolean" ? (
          <Form.Select
            value={formData[field.label] !== undefined ? formData[field.label] : ""}
            onChange={(e) => onFieldChange(field.label, e.target.value === "true")}
          >
            <option value="" disabled>Valitse</option>
            <option value="true">Kyllä</option>
            <option value="false">Ei</option>
          </Form.Select>
        ) : (
          <Form.Control
            type={field.type}
            value={formData[field.label] || ""}
            onChange={(e) => onFieldChange(field.label, e.target.value)}
          />
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
