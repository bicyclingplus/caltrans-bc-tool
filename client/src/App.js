import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import BCTool from './BCTool/BCTool';

function App() {

  const [newProject, setNewProject] = useState(true);

  const startNewProject = () => {
    setNewProject(true);
  }

  const projectStarted = () => {
    setNewProject(false);
  }

  return (
    <div>
      <Header startNewProject={startNewProject} />

      <main role="main" className="main">
        <BCTool newProject={newProject} projectStarted={projectStarted} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
