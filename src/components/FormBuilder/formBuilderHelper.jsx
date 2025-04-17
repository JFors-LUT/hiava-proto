export const addField = () => {
    if (!fieldName.trim()) return;
    setFields([...fields, { name: fieldName, type: fieldType }]);
    setFieldName("");
    setFieldType("text");
  };

export const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

export const saveForm = () => {
    if (!formName.trim() || fields.length === 0) return;

    const savedForms = JSON.parse(localStorage.getItem("savedForms")) || [];
    const newForm = { name: formName, fields };

    localStorage.setItem("savedForms", JSON.stringify([...savedForms, newForm]));
    setFormName("");
    setFields([]);
    alert("Lomake tallennettu!");
  };