import { useEffect, useState } from "react";
import { Form, Button, Card, Table } from "react-bootstrap";
import AccessDeniedMessage from "@/components/common/AccessDenied";
import  useRequireRole from "@/hooks/useRequireRole";
import { addField, removeField, saveForm } from "./formBuilderHelper";

export default function FieldBuilder() {
  const [formName, setFormName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [fields, setFields] = useState([]);
  const { loading, accessDenied } = useRequireRole("expert");
  

  if (loading) return <p>Ladataan...</p>;
  if (accessDenied) return <AccessDeniedMessage />;

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h3 className="mb-4">Lomakekenttien rakentaja</h3>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Lomakkeen nimi"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </Form.Group>

          <Form className="d-flex gap-3 flex-wrap">
            <Form.Control
              type="text"
              placeholder="Kentän nimi"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <Form.Select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
            >
              <option value="text">Teksti</option>
              <option value="number">Numero</option>
              <option value="boolean">Totuusarvo</option>
            </Form.Select>
            <Button onClick={() => addField(fieldName, fieldType, setFields, fields, setFieldName, setFieldType)}>
              Lisää kenttä
            </Button>
          </Form>

          {fields.length > 0 && (
            <Button className="mt-3" variant="success" onClick={() => saveForm(formName, fields, setFormName, setFields)}>
              Tallenna lomake
            </Button>
          )}
        </Card.Body>
      </Card>

      {fields.length > 0 && (
        <Card className="mt-4">
          <Card.Body>
            <h5>Lisätyt kentät</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nimi</th>
                  <th>Tyyppi</th>
                  <th>Toiminnot</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index}>
                    <td>{field.name}</td>
                    <td>{field.type}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeField(index, setFields, fields)}
                      >
                        Poista
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
