import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CreatePersonModal from './components/CreatePersonModal';
import CreateSkillModal from './components/CreateSkillModal';
import CreateProjectModal from './components/CreateProjectModal';

import DashboardPage from './pages/DashboardPage';
import PeoplePage from './pages/PeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import SkillsPage from './pages/SkillsPage';
import SkillDetailPage from './pages/SkillDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import GraphExplorerPage from './pages/GraphExplorerPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [createPersonOpen, setCreatePersonOpen] = useState(false);
  const [createSkillOpen, setCreateSkillOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenCreatePerson={() => setCreatePersonOpen(true)}
        onOpenCreateSkill={() => setCreateSkillOpen(true)}
        onOpenCreateProject={() => setCreateProjectOpen(true)}
      />

      {/* Main Page Routing Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          
          <Route path="/people" element={<PeoplePage onOpenCreatePerson={() => setCreatePersonOpen(true)} />} />
          <Route path="/people/:id" element={<PersonDetailPage />} />

          <Route path="/skills" element={<SkillsPage onOpenCreateSkill={() => setCreateSkillOpen(true)} />} />
          <Route path="/skills/:id" element={<SkillDetailPage />} />

          <Route path="/projects" element={<ProjectsPage onOpenCreateProject={() => setCreateProjectOpen(true)} />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          <Route path="/graph" element={<GraphExplorerPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Node Creation Modals */}
      <CreatePersonModal
        isOpen={createPersonOpen}
        onClose={() => setCreatePersonOpen(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <CreateSkillModal
        isOpen={createSkillOpen}
        onClose={() => setCreateSkillOpen(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />
    </div>
  );
}
