import React, { ReactNode, useEffect, useRef } from 'react';
import { X } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        document.addEventListener('keydown', handleEsc);
        // Focus the modal when it opens for accessibility
        setTimeout(() => modalRef.current?.focus(), 0);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-dark-surface rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1} // Make div focusable
      >
        <div className="flex justify-between items-center border-b border-dark-border pb-4 mb-4">
          <h2 id="modal-title" className="text-xl font-semibold text-dark-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-dark-text-secondary hover:bg-dark-border hover:text-dark-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;