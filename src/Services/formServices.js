const API_BASE = import.meta.env.VITE_API_BASE_URL;  // Käytämme Viteä

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
