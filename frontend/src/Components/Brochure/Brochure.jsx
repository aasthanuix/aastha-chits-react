import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import BrochureForm from './BrochureForm';
import './BrochureForm.css';

const Brochure = ({url}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fixed-brochure-container">
        <button className="fixed-brochure-button" onClick={() => setShowModal(true)}>
          Download Brochure <FontAwesomeIcon icon={faFilePdf} />
        </button>
      </div>

      <BrochureForm url={url} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Brochure;
