import { useState } from "react";
import HandleInput from "@/components/HandleInput";
import ResultsDisplay from "@/components/ResultsDisplay";
import LoadingHourglass from "@/components/LoadingHourglass";
import { Users } from "lucide-react";
import axios from "axios";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const handleSubmit = async (handles) => {
    setIsLoading(true);
    const startTime = performance.now();

    const initialProfiles = handles.map((handle) => ({
      handle,
      contentSaturation: { daily: 0, weekly: 0, monthly: 0 },
      classification: "",
      location: "",
      status: "pending",
    }));

    setProfiles(initialProfiles);

    try {
      const profileStartTime = performance.now();

      const response = await axios.post(`/api/analyze`, { handles });

      const profileEndTime = performance.now();
      console.log(
        `Profile analysis took ${(
          (profileEndTime - profileStartTime) /
          1000
        ).toFixed(2)} seconds`
      );

      setProfiles(response.data.profiles);
    } catch (error) {
      console.log("Error analyzing profiles:", error);
      setProfiles(
        handles.map((handle) => ({
          handle: handle,
          status: "error",
          error: "Failed to analyze profile",
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Users size={48} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          X-User Profiler
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze X profiles to determine content saturation, user
          classification, and location.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <HandleInput onSubmit={handleSubmit} isLoading={isLoading} />
        {isLoading ? (
          <LoadingHourglass />
        ) : (
          <ResultsDisplay profiles={profiles} />
        )}
      </div>
    </div>
  );
}

export default Home;
