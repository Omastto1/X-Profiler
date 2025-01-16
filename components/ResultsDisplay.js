import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";

/**
 * Displays analysis results for X (Twitter) profiles in a table format
 * @param {Object} props - The component props
 * @param {Array<Object>} props.profiles - Array of profile objects to display
 * @param {string} props.profiles[].handle - The X handle
 * @param {string} props.profiles[].status - Current status ('pending'|'completed'|'error')
 * @param {string} [props.profiles[].imageUrl] - URL to profile image
 * @param {Object} [props.profiles[].contentSaturation] - Content saturation metrics
 * @param {number} [props.profiles[].contentSaturation.daily] - Daily content saturation percentage
 * @param {number} [props.profiles[].contentSaturation.weekly] - Weekly content saturation percentage
 * @param {number} [props.profiles[].contentSaturation.monthly] - Monthly content saturation percentage
 * @param {string} [props.profiles[].classification] - User classification/categories
 * @param {string} [props.profiles[].location] - User's determined location
 * @returns {JSX.Element|null} A table displaying profile analysis results or null if no profiles
 */
function ResultsDisplay({ profiles }) {
  if (profiles.length === 0) return null;

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Saturation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile, index) => (
                <tr key={profile.handle + index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {profile.status === "completed" && profile.imageUrl ? (
                      <img 
                        src={profile.imageUrl} 
                        alt={`${profile.handle}'s avatar`}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      <a href={`https://x.com/${profile.handle}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">@{profile.handle}</a>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {profile.status === "completed" ? (
                      <div className="text-sm text-gray-900">
                        <div>Daily: {profile.contentSaturation.daily ? `${profile.contentSaturation.daily}%` : "-"}</div>
                        <div>Weekly: {profile.contentSaturation.weekly ? `${profile.contentSaturation.weekly}%` : "-"}</div>
                        <div>Monthly: {profile.contentSaturation.monthly ? `${profile.contentSaturation.monthly}%` : "-"}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="group relative">
                      <span className="text-sm text-gray-900">
                        {profile.status === "completed"
                          ? profile.classification.slice(0, 20) + (profile.classification.length > 20 ? "..." : "")
                          : "-"}
                      </span>
                      {profile.status === "completed" && profile.classification.length > 20 && (
                        <div className="absolute z-10 invisible group-hover:visible bg-black text-white p-2 rounded text-sm -translate-y-full left-0 top-0 whitespace-normal max-w-xs">
                          {profile.classification}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {profile.status === "completed" ? profile.location : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {profile.status === "pending" && (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      {profile.status === "processing" && (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      )}
                      {profile.status === "completed" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {profile.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="ml-2 text-sm text-gray-500">
                        {profile.status?.charAt(0).toUpperCase() +
                          profile.status?.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;
