import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Tervetuloa Lomakesovellukseen</h1>
      
      <div className="space-y-4">
        <Link
          to="/fill-form"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Täytä Lomake
        </Link>
        
        <Link
          to="/build-form"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Rakenna Lomake
        </Link>
      </div>
    </div>
  );
}
