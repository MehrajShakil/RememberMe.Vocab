import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import DailyWordsPage from '../pages/DailyWordsPage';
import AddWordPage from '../pages/AddWordPage';
import WordListPage from '../pages/WordListPage';
import SettingsPage from '../pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DailyWordsPage />} />
          <Route path="/add" element={<AddWordPage />} />
          <Route path="/words" element={<WordListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
