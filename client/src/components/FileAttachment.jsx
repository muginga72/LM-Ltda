// src/components/FileAttachment.jsx
import React from 'react';

const FileAttachment = ({ filePath, label }) => {
  if (!filePath) {
    return (
      <div className="alert alert-warning" role="alert">
        ⚠️ File not found. Please re-upload or contact support.
      </div>
    );
  }

  // Normalize path and detect type
  const fileUrl = filePath.startsWith('/uploads') ? filePath : `/uploads/${filePath}`;
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  const isPDF = /\.pdf$/i.test(filePath);

  return (
    <div className="file-attachment mt-2">
      <h6>{label}</h6>
      {isImage ? (
        <img
          src={fileUrl}
          alt="Attachment"
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
          📄 View PDF
        </a>
      ) : (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-secondary btn-sm"
        >
          📎 Download File
        </a>
      )}
    </div>
  );
};

export default FileAttachment;