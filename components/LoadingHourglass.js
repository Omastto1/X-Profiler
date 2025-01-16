import { useEffect, useState } from 'react';

const LoadingHourglass = () => {
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Downloading user profiles...',
    'Downloading user followers...',
    'Downloading user tweets...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Wait</h2>
        <p className="text-sm text-gray-600">It may take around 30 seconds to finish</p>
      </div>
      
      <div className="hourglass"></div>
      
      <div className="text-lg font-medium text-blue-600">
        {loadingMessages[loadingStep]}
      </div>
    </div>
  );
};

export default LoadingHourglass;
