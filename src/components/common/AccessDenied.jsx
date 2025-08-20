// src/components/common/AccessDenied.jsx
const AccessDeniedMessage = ({ message }) => {
  return (
    <div className="p-8 max-w-xl mx-auto text-center container mt-5 pt-4">      
      <div className="alert alert-danger" role="alert">
        {/*Virheilmoitus tai geneerinen virheviesti*/}
        {message || "Toiminto epäonnistui."}
      </div>
    </div>
  );
};

export default AccessDeniedMessage;