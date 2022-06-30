import React, { useState, useEffect } from 'react';

import './Header.css';
import resourcesIcon from './resources.png';
import helpIcon from './help.png';

const Modal = require('bootstrap/js/dist/modal');


function Header(props) {

  let [ confirmModal, setConfirmModal ] = useState(null);

  useEffect(() =>  {

    setConfirmModal(new Modal(document.getElementById('bc-tool-confirm'), {
      backdrop: 'static',
    }));

  }, []);

  const openModal = () => {
    confirmModal.show();
  }

  return (
    <>
    <div className="modal" tabIndex="-1" id="bc-tool-confirm">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Start New Project</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to start a new project?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={props.startNewProject}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    <div className="sticky-top">
      <div className="container-fluid top-header">
        <div className="row">
          <div className="col clearfix">
            <h1 className="float-start">ITS Logo</h1>
            <h1 className="float-end">ATRC Logo</h1>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand">
        <div className="container-fluid">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-wrap">
           <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="resourcesDropdow" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={resourcesIcon} alt="book icon" /> Resources
            </a>
            <ul className="dropdown-menu" aria-labelledby="resourcesDropdow">
              <li><a className="dropdown-item" href="#">Technical Documentation</a></li>
              <li><a className="dropdown-item" href="#">Literature Review</a></li>
            </ul>
            </li>
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="helpDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={helpIcon} alt="pencil icon" /> Help
            </a>
            <ul className="dropdown-menu" aria-labelledby="helpDropdown">
              <li><a className="dropdown-item" href="#">About</a></li>
              <li><a className="dropdown-item" href="#">User Guide</a></li>
              <li><a className="dropdown-item" href="#">Training</a></li>
            </ul>
            </li>
          </ul>

          <button className="btn btn-lg btn-restart" onClick={openModal}>Start New Project</button>
        </div>
      </nav>
    </div>
  </>
  );
}

export default Header