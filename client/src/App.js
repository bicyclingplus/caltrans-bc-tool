import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import BCTool from './BCTool/BCTool';

function App() {
  return (
    <div>
      <Header />

      <main role="main" className="main">
        <BCTool />
      </main>

      <Footer />
    </div>
  );
}

export default App;
