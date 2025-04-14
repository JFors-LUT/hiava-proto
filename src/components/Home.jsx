import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8 max-w-xl mx-auto text-center container mt-5 pt-4">
      <div className="alert alert-success" role="alert">
        Tervetuloa! Tämä alert ei katoa.
      </div>
      <h1>Etusivu</h1>
      <p>Tämä on kandityön lomakeohjelman etusivu.</p>
    </div>
  );
}