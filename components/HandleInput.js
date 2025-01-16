import { useState } from 'react';
import { Send } from 'lucide-react';

/**
 * A form component for inputting X (Twitter) handles
 * @param {Object} props - The component props
 * @param {Function} props.onSubmit - Callback function called with array of handles when form is submitted
 * @param {boolean} props.isLoading - Whether the form is in a loading state
 * @returns {JSX.Element} A form with textarea for handles and a submit button
 */
function HandleInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');

  /**
   * Handles form submission by parsing comma-separated handles and calling onSubmit
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const handles = input
      .split(',')
      .map(handle => handle.trim())
      .filter(Boolean);
    
    if (handles.length > 0) {
      onSubmit(handles);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <label 
          htmlFor="handles" 
          className="text-sm font-medium text-gray-700"
        >
          Enter X handles (comma-separated)
        </label>
        <div className="flex gap-2">
          <textarea
            id="handles"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., elonmusk, jack, vitalikbuterin"
            className="flex-1 min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={20} />
            {isLoading ? 'Processing...' : 'Analyze'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default HandleInput;