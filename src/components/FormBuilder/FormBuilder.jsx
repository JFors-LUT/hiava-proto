import { useEffect, useState } from "react";
import { Form, Button, Card, Table, Alert } from "react-bootstrap";
import AccessDeniedMessage from "@/components/common/AccessDenied";
import useRequireRole from "@/hooks/useRequireRole";
import { saveForm, deleteForm } from "@/Services/formServices";
import { addField, removeField, editField } from "./formBuilderHelper";

//Maksimi merkkien määrä kentille
let maxLength = 64;

export default function FieldBuilder() {
  const [formName, setFormName] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);
  const [fields, setFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedFieldName, setEditedFieldName] = useState("");
  const [editedFieldType, setEditedFieldType] = useState("text");
  const [editedMinValue, setEditedMinValue] = useState("");
  const [editedMaxValue, setEditedMaxValue] = useState("");
  const [editedIsMandatory, setEditedIsMandatory] = useState(false);

  const { loading, accessDenied } = useRequireRole("expert");

  if (loading) return <p>Ladataan...</p>;
  if (accessDenied) return <AccessDeniedMessage />;

  //lisää kenttä, button click ja enter painaminen
  const handleAddField = () => {
    const isDuplicate = fields.some((field) => field.name === fieldName.trim());
    if (!fieldName.trim()) {
      setErrorMessage("Kentän nimi ei voi olla tyhjä.");
    } else if (isDuplicate) {
      setErrorMessage("Kentän nimi on jo olemassa.");
    } else {
      setErrorMessage(""); // Tyhjennä aiemmat virheet
      addField(fieldName.trim(), fieldType, minValue, maxValue, isMandatory, setFields, fields, setFieldName, setFieldType, setMinValue, setMaxValue, setIsMandatory, setErrorMessage);
    }
    setSuccessMessage("");
  };

  const handleSave = async () => {
    // Tarkistetaan, onko lomaketta olemassa
  if(!formName){
    setErrorMessage("Aseta lomakkeelle nimi.");
    return []; // Palautetaan tyhjä taulukko, jotta lomaketta ei tallenneta
  }
    // Estetään tyhjän lomakkeen tallennus
    if (!formName.trim()) {
      setErrorMessage("Lomakkeen nimi ei voi olla tyhjä.");
      return;
    }

    if (formName.length > maxLength) {
      setErrorMessage(`Lomakkeen nimi ei voi olla yli ${maxLength} merkkiä pitkä.`);
      return;
    }

    // Tuplavarmistus
    const confirmSave = window.confirm(`Haluatko varmasti tallentaa lomakkeen "${formName}"?`);
    if (!confirmSave) return;

    const formToSave = {
      name: formName,
      fields: fields,
    };
    setErrorMessage("");
    try {
      const response = await saveForm(formToSave);
      console.log("Tallennus onnistui:", response);
      setSuccessMessage("Lomake tallennettu onnistuneesti!");
      setErrorMessage("");

      // Tyhjennetään lomakkeen kentät
      setFormName("");
      setFields([]);
      setFieldName("");
      setFieldType("text");
      setMinValue("");
      setMaxValue("");
      setIsMandatory(false);
    } catch (error) {
      console.error("Tallennus epäonnistui:", error);
      setErrorMessage(`Tallennus epäonnistui: ${error.message || error.toString()}`);
    }
  };

  const handleDelete = async () => {
    if (!formName) {
      setErrorMessage("Kirjoita poistettavan lomakkeen nimi.");
      return;
    }
  
    const userInput = window.prompt(
      `Vahvista poistettava lomake kirjoittamalla lomakkeen nimi: "${formName}"`
    );

    //käyttäjä painoi 'Peru'
    if (userInput === null) {
      setErrorMessage("");
      return;
    }
  
    if (userInput !== formName) {
      setErrorMessage("Poisto peruutettu. Nimi ei täsmännyt.");
      return;
    }
    
    try {
      const response = await deleteForm(formName)
      setSuccessMessage(`${response.status}: lomake poistettu.`);
      setErrorMessage("");
      setFormName("");
      setFields([]);
      setMinValue("");
      setMaxValue("");
      setIsMandatory(false);
    } catch (err) {
      setErrorMessage(`Poisto epäonnistui: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <h3 className="mb-4">Lomakekenttien rakentaja</h3>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Lomakkeen nimi"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </Form.Group>

          <Form className="d-flex gap-3 flex-wrap"
          onSubmit={(e) =>{ 
            e.preventDefault() //estää Enter painamisesta aiheutuvan sivun päivityksen
            handleAddField();
          }}
          >
            
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
              <option value="string">Teksti</option>
              <option value="number">Numero</option>
              <option value="boolean">Totuusarvo</option>
            </Form.Select>
            
            {fieldType === "number" && (
              <>
                <Form.Control
                  type="number"
                  placeholder="Min arvo"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
                <Form.Control
                  type="number"
                  placeholder="Max arvo"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </>
            )}
            
            <Form.Check
              type="checkbox"
              label="Pakollinen kenttä"
              checked={isMandatory}
              onChange={(e) => setIsMandatory(e.target.checked)}
            />
            
            <Button
              onClick={() => {
                handleAddField();
              }}
            >
              Lisää kenttä
            </Button>

            <Button
              className="position-absolute bottom-0 end-0 mb-2 me-2"
              variant="danger"
              onClick={handleDelete}
            >
              Poista lomake
            </Button>

          </Form>

          {fields.length > 0 && (
            <Button className="mt-3" variant="success" onClick={handleSave}>
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
      <th>Min/Max</th>
      <th>Pakollinen</th>
      <th>Toiminnot</th>
    </tr>
  </thead>
  <tbody>
    {fields.map((field, index) => (
      <tr key={index}>
        <td>
          {editIndex === index ? (
            <Form.Control
              type="text"
              value={editedFieldName}
              onChange={(e) => setEditedFieldName(e.target.value)}
            />
          ) : (
            field.name
          )}
        </td>
        <td>
          {editIndex === index ? (
            <Form.Select
              value={editedFieldType}
              onChange={(e) => setEditedFieldType(e.target.value)}
            >
              <option value="string">Teksti</option>
              <option value="number">Numero</option>
              <option value="boolean">Totuusarvo</option>
            </Form.Select>
          ) : (
            field.type
          )}
        </td>
        <td>
          {editIndex === index ? (
            editedFieldType === "number" ? (
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={editedMinValue}
                  onChange={(e) => setEditedMinValue(e.target.value)}
                  size="sm"
                />
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={editedMaxValue}
                  onChange={(e) => setEditedMaxValue(e.target.value)}
                  size="sm"
                />
              </div>
            ) : (
              <span className="text-muted">-</span>
            )
          ) : (
            field.type === "number" && field.min !== undefined && field.max !== undefined ? (
              `${field.min} - ${field.max}`
            ) : (
              field.type === "number" ? (
                <span className="text-muted">Ei rajoja</span>
              ) : (
                <span className="text-muted">-</span>
              )
            )
          )}
        </td>
        <td>
          {editIndex === index ? (
            <Form.Check
              type="checkbox"
              checked={editedIsMandatory}
              onChange={(e) => setEditedIsMandatory(e.target.checked)}
            />
          ) : (
            field.mandatory ? (
              <span className="text-success">✓</span>
            ) : (
              <span className="text-muted">-</span>
            )
          )}
        </td>
        <td className="position-relative">
          {editIndex === index ? (
            <>
              <Button
                variant="success"
                size="sm"
                className="me-2"  // Lisää tilaa napille
                onClick={() =>
                  editField(
                    index,
                    editedFieldName,
                    editedFieldType,
                    editedMinValue,
                    editedMaxValue,
                    editedIsMandatory,
                    fields,
                    setFields,
                    setErrorMessage,
                    setEditIndex
                  )
                }
              >
                Tallenna
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setEditIndex(null)}
              >
                Peruuta
              </Button>
            </>
          ) : (
            //piilotetaan muokkaa/poista näppäimet näkyvistä, jos kenttän tietoja aletaan muokkaamaan
            editIndex === null && (
              <>
              <Button
                variant="warning"
                size="sm"
                className="me-1"  // Lisää tilaa napille
                onClick={() => {
                  setEditedFieldName(field.name);
                  setEditedFieldType(field.type);
                  setEditedMinValue(field.min || "");
                  setEditedMaxValue(field.max || "");
                  setEditedIsMandatory(field.mandatory || false);
                  setEditIndex(index);
                }}
              >
                Muokkaa
              </Button>
              <div className="d-flex">
                
              <Button
              //nappi siirretty kauemmas oikealle virheiden välttämiseksi
                className="position-absolute bottom-0 end-0 mb-2 me-2"
                variant="danger"
                size="sm"
                onClick={() => removeField(index, setFields, fields)}
              >
                 
                Poista
              </Button>
              </div>
            </>
            )
          )}
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


