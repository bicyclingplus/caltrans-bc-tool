import React, { useState, useEffect } from 'react';
import { useLocation, Link, NavLink } from "react-router-dom";

import './Header.css';

const Modal = require('bootstrap/js/dist/modal');


function Header(props) {

  const location = useLocation();

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
            <h1 className="float-start"><Link to="/">ITS Logo</Link></h1>
            <h1 className="float-end">ATRC Logo</h1>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand">
        <div className="container-fluid">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-wrap">
           <li className="nav-item dropdown">
            <button className="btn dropdown-toggle btn-link nav-link btn-borderless" id="resourcesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              Resources
            </button>
            <ul className="dropdown-menu" aria-labelledby="resourcesDropdown">
              <li><NavLink className="dropdown-item" to="technicaldocs">Technical Documentation</NavLink></li>
              <li><NavLink className="dropdown-item" to="litreview">Literature Review</NavLink></li>
            </ul>
            </li>
            <li className="nav-item dropdown ms-5">
            <button className="btn dropdown-toggle btn-link nav-link btn-borderless" id="helpDropdown" data-bs-toggle="dropdown" aria-expanded="false">
             Help
            </button>
            <ul className="dropdown-menu" aria-labelledby="helpDropdown">
              <li><NavLink className="dropdown-item" to="about">About</NavLink></li>
              <li><NavLink className="dropdown-item" to="userguide">User Guide</NavLink></li>
              <li><NavLink className="dropdown-item" to="training">Training</NavLink></li>
            </ul>
            </li>
          </ul>

          <>
          { location.pathname === '/' ?
            <button className="btn btn-lg btn-restart" onClick={openModal}>Start New Project</button>
          : null }
          </>
        </div>
      </nav>
    </div>
  </>
  );
}

export default Header