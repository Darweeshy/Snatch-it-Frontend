import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full p-6 bg-white rounded-lg shadow-xl ${sizeClasses[size] || sizeClasses.md}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 id="modal-title" className="text-lg font-bold text-secondary-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-800"
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;