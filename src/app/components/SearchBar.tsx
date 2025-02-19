"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {

  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [error, setError] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // URL validation function
  const isValidWebsiteUrl = (input: string) => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (err) {
      return false;
    }
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);

    if (isValidWebsiteUrl(input)) {
      setIsValidUrl(true);
      setError("");
    } else {
      setIsValidUrl(false);
      setError("Please enter a valid website URL (starting with http:// or https://)");
    }
  };

  // Handle form submission
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidUrl || !additionalText.trim()) return;

    setLoading(true);
    setResults([]); // Reset previous result

    try {
      const response = await fetch(
        `/api/search?url=${encodeURIComponent(url)}&text=${encodeURIComponent(additionalText)}`
      );
      const data = await response.json();
      setResults(data.results);
      console.log("Search results:", data.results);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="relative max-w-lg mx-auto mt-10">
          <div>
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter domain"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-black"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Additional Text Field (Only visible when URL is valid) */}
          {isValidUrl && (
            <div>
              <input
                type="text"
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
                placeholder="Enter additional text"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-black mt-5"
              />
            </div>
          )}

          <button
            type="submit"
            className={`mt-5 px-4 py-2 w-full rounded-lg text-white ${isValidUrl && additionalText.trim() ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={!isValidUrl || !additionalText.trim()}
          >
            <Search className="absolute right-4 top-3 text-gray-400" />
            Search
          </button>
        </div>
      </form>
      {/* Show Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Render Results */}
      {/* Render Search Result */}
      {results && results.length > 0 ? (
        <div className="mt-4 p-2 text-center text-green-500">
          <p className="font-semibold">Text found in the following URLs:</p>
          <ul className="mt-2 text-left">
            {results.map((url: string, index: number) => (
              <li key={index} className="underline text-blue-500 hover:text-blue-700">
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 p-2 text-center text-red-500">
          Text not found in any URLs.
        </p>
      )}


    </div>
  );
}