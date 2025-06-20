import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Locations from './pages/Locations';
import Courses from './pages/Courses';
import Vendors from './pages/Vendors';
import Batches from './pages/Batches';
import Certifications from './pages/Certifications';
import Employees from './pages/Employees';
import Reports from './pages/Reports';

const Marketing = () => <div className="p-6"><h1 className="text-2xl font-bold">E-Marketing</h1><p>Marketing management coming soon...</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="locations" element={<Locations />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="courses" element={<Courses />} />
          <Route path="batches" element={<Batches />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="employees" element={<Employees />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;