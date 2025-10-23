// ✅ src/components/ProofAttachment.jsx — no react-pdf needed
import React from 'react';

const ProofAttachment = ({ filePath, serviceTitle }) => {
  if (!filePath) {
    return (
      <div className="alert alert-warning" role="alert">
        ⚠️ Proof file not found. Please re-upload or contact support.
      </div>
    );
  }

  const fileUrl = filePath.startsWith('/uploads') ? filePath : `/uploads/${filePath}`;
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  const isPDF = /\.pdf$/i.test(filePath);

  return (
    <div className="proof-attachment mt-2">
      <h6>Proof of Payment for "{serviceTitle}"</h6>
      {isImage ? (
        <img
          src={fileUrl}
          alt="Proof"
          style={{
            maxWidth: '100%',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        />
      ) : isPDF ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary btn-sm"
        >
          📄 View PDF Proof
        </a>
      ) : (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-secondary btn-sm"
        >
          📎 Download Attachment
        </a>
      )}
    </div>
  );
};

export default ProofAttachment;