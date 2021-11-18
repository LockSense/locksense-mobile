import * as React from 'react';
import Button from '../buttons/Button';
import QuestionMarkCircle from '../icons/QuestionMarkCircle';

interface ChoiceModalProps {
  title: string;
  content: string;
  buttonLabels: string[];
  onClick: (index: number) => void;
}

const ChoiceModal: React.FC<ChoiceModalProps> = ({
  title,
  content,
  buttonLabels,
  onClick,
}: ChoiceModalProps) => {
  return (
    <div
      className="fixed z-10 inset-x-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-center px-4 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <QuestionMarkCircle color="blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{content}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 grid grid-cols-2 gap-2">
            {buttonLabels.map((label, index) => (
              <Button
                key={label + index}
                type="button"
                className="justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => onClick(index)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
