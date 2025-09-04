//kenttien maksimi pituus
let maxLength = 64;

export const addField = (fieldName, fieldType, minValue, maxValue, isMandatory, setFields, fields, setFieldName, setFieldType, setMinValue, setMaxValue, setIsMandatory, setErrorMessage) => {
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

  // Tarkistetaan numeroarvojen validiteetti
  if (fieldType === "number") {
    const min = minValue !== "" ? Number(minValue) : undefined;
    const max = maxValue !== "" ? Number(maxValue) : undefined;
    
    if (min !== undefined && max !== undefined && min > max) {
      setErrorMessage("Minimi arvo ei voi olla suurempi kuin maksimi arvo.");
      return;
    }
  }

  // Lisää kenttä
  const newField = { 
    name: fieldName, 
    type: fieldType,
    mandatory: isMandatory,
    ...(fieldType === "number" && {
      min: minValue !== "" ? Number(minValue) : undefined,
      max: maxValue !== "" ? Number(maxValue) : undefined
    })
  };
  setFields([...fields, newField]);

  // Tyhjennetään kenttä nimi, tyyppi ja arvot
  setFieldName('');
  setFieldType('text');
  setMinValue('');
  setMaxValue('');
  setIsMandatory(false);
};


export const removeField = (index, setFields, fields) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  export const editField = (index, newName, newType, minValue, maxValue, isMandatory, fields, setFields, setErrorMessage, setEditIndex) => {
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

    // Tarkistetaan numeroarvojen validiteetti
    if (newType === "number") {
      const min = minValue !== "" ? Number(minValue) : undefined;
      const max = maxValue !== "" ? Number(maxValue) : undefined;
      
      if (min !== undefined && max !== undefined && min > max) {
        setErrorMessage("Minimi arvo ei voi olla suurempi kuin maksimi arvo.");
        return;
      }
    }
  
    const updatedFields = [...fields];
    updatedFields[index] = {
      name: trimmedName,
      type: newType,
      mandatory: isMandatory,
      ...(newType === "number" && {
        min: minValue !== "" ? Number(minValue) : undefined,
        max: maxValue !== "" ? Number(maxValue) : undefined
      })
    };
  
    setFields(updatedFields);
    setEditIndex(null);
    setErrorMessage("");
  };

  