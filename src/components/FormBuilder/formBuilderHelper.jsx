//kenttien maksimi pituus
let maxLength = 64;

export const addField = (fieldName, fieldType, setFields, fields, setFieldName, setFieldType, setErrorMessage) => {
  // Tarkistetaan, että kentän nimi on alle 64 merkkiä
  if (fieldName.length > maxLength) {
    setErrorMessage(`Kentän nimi ei voi olla yli ${maxLength} merkkiä pitkä.`);
    return;
  }

  // Tarkistetaan, että kentän nimi on uniikki
  if (fields.some(field => field.name === fieldName)) {
    setErrorMessage("Kentän nimi ei voi olla sama kuin aiemmin lisätyn kentän nimi.");
    return;
  }

  // Lisää kenttä
  const newField = { name: fieldName, type: fieldType };
  setFields([...fields, newField]);

  // Tyhjennetään kenttä nimi ja tyyppi
  setFieldName('');
  setFieldType('text');
};


export const removeField = (index, setFields, fields) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  export const editField = (index, newName, newType, fields, setFields, setErrorMessage, setEditIndex) => {
    const trimmedName = newName.trim();
  
    if (!trimmedName) {
      setErrorMessage("Kentän nimi ei voi olla tyhjä.");
      return;
    }
  
    const isDuplicate = fields.some((f, i) => f.name === trimmedName && i !== index);
    if (isDuplicate) {
      setErrorMessage("Kentän nimi on jo olemassa.");
      return;
    }

    if (trimmedName.length > maxLength) {
      setErrorMessage(`Kentän nimi ei voi olla yli ${maxLength} merkkiä pitkä.`);
      return;
    }
  
    const updatedFields = [...fields];
    updatedFields[index] = {
      name: trimmedName,
      type: newType,
    };
  
    setFields(updatedFields);
    setEditIndex(null);
    setErrorMessage("");
  };

  