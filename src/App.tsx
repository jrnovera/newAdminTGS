import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VenueProvider } from './context/VenueContext';
import { VenueOwnerProvider } from './context/VenueOwnerContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Venues from './pages/Venues';
import VenueDetail from './pages/VenueDetail';
import Enquiries from './pages/Enquiries';
import VenueOwners from './pages/VenueOwners';
import VenueOwnerDetail from './pages/VenueOwnerDetail';
import RetreatHosts from './pages/RetreatHosts';
import WellnessGuests from './pages/WellnessGuests';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import WellnessEdit from './pages/WellnessEdit';
import SanctumJournal from './pages/SanctumJournal';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <VenueProvider>
    <VenueOwnerProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/enquiries" element={<Enquiries />} />
          <Route path="/venue-owners" element={<VenueOwners />} />
          <Route path="/venue-owners/:id" element={<VenueOwnerDetail />} />
          <Route path="/retreat-hosts" element={<RetreatHosts />} />
          <Route path="/wellness-guests" element={<WellnessGuests />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/wellness-edit" element={<WellnessEdit />} />
          <Route path="/sanctum-journal" element={<SanctumJournal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </VenueOwnerProvider>
    </VenueProvider>
  );
}

export default App
