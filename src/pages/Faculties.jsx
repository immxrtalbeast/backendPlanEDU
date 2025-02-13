import { Link } from 'react-router-dom';
import Header from '../compnents/Header';

const faculties = [
  { id: 'ВМО', name: 'ВМО' },
  { id: 'ВПР', name: 'ВПР' },
  { id: 'ВКБ', name: 'ВКБ' },
  { id: 'ВИАС', name: 'ВИАС' },
];

export default function Faculties() {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-900 dark:text-white">
          Выберите факультет
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {faculties.map((faculty) => (
            <Link
              key={faculty.id}
              to={`/roadmap/${faculty.id}`}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-blue-900 dark:text-white font-semibold hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
            >
              {faculty.name}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
