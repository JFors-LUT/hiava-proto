const API_BASE = import.meta.env.VITE_API_BASE_URL;  //Vite ympäristömuuttuja serverin osoitteeksi

export const getForms = async (formName) => {
  const token = localStorage.getItem("authToken");

  if(formName != ""){

  // Käytetään haun suodattamista formName:n perusteella
  const res = await fetch(`${API_BASE}/forms?formName=${formName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Lomakkeen haku epäonnistui");

  return await res.json();
}
};

export const submitForm = async (formData) => {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/forms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Lähetys epäonnistui");

  return await res.json();
};

export const saveForm = async (form) => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${API_BASE}/forms/save`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new Error("Lomakkeen tallennus epäonnistui");
  };

  return await res.json(); // palautetaan esim. tallennettu lomake tai viesti
};

export const deleteForm = async (form) => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${API_BASE}/forms/${form}`, { 
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }, 
  });
  if (!res.ok) throw new Error("Lomaketta ei löydetty.");
  return res;
};

export const getAccessibleForms = async () => {
  const token = localStorage.getItem('authToken');

  const res = await fetch(`${API_BASE}/forms/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Käyttöoikeutettujen lomakkeiden haku epäonnistui');
  const data = await res.json();
  return data.forms; // string[]
};

