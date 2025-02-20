"use client";
import { useState } from "react";
import { ChevronDown, Rocket } from "lucide-react";

export default function CrawlForm() {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [error, setError] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const [crawlWholeSite, setCrawlWholeSite] = useState(false);
  const [apiResponse, setApiResponse] = useState<{ status?: String, message?: string, results?: any[] }>({});
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [crawlType, setCrawlType] = useState("Select Type");

  const crawlTypes = [
    { type: "Text", icon: <Rocket /> },
    { type: "PDF", icon: <Rocket /> }
  ];

  const isValidWebsiteUrl = (input: string) => {
    try {
      const urlObj = new URL(input);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch (err) {
      return false;
    }
  };

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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidUrl || !additionalText.trim() || crawlType === "Select Type") return;

    setLoading(true);
    setApiResponse({});

    try {
      const response = await fetch(
        `/api/search?url=${encodeURIComponent(url)}&text=${encodeURIComponent(additionalText)}&crawlType=${encodeURIComponent(crawlType)}&crawlWholeSite=${crawlWholeSite}`
      );
      const data = await response.json();
      setApiResponse(data);
      console.log("apiResponse:", data);
    } catch (error) {
      console.error("Search error:", error);
      setApiResponse({ status: "error", message: "An error occurred while searching" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative max-w-full mx-auto mt-10 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter domain or URL"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-black"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex-2 pt-3">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={crawlWholeSite}
                onChange={(e) => setCrawlWholeSite(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              Crawl whole site
            </label>
          </div>
        </div>

        {isValidUrl && (
          <div className="relative max-w-full mx-auto flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
                placeholder="Enter Keyword"
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-black mt-5"
              />
            </div>
            <div className="flex-2 pt-5">
              <button
                type="button"
                className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                  {crawlType !== "Select Type" && crawlTypes.find((cType) => cType.type === crawlType)?.icon}
                  <span className="block truncate">{crawlType}</span>
                  <ChevronDown className="ml-auto" />
                </span>
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-none sm:text-sm">
                  {crawlTypes.map((crawlType) => (
                    <li key={crawlType.type} className="cursor-pointer py-2 pr-9 pl-3 text-gray-900 hover:bg-indigo-600 hover:text-white" onClick={() => { setCrawlType(crawlType.type); setIsDropdownOpen(false); }}>
                      <div className="flex items-center">
                        {crawlType.icon}
                        <span className="ml-3 block truncate">{crawlType.type}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        <button
          type="submit"
          className={`mt-5 px-4 py-2 w-full rounded-lg text-white ${isValidUrl && additionalText.trim() && crawlType !== "Select Type" ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
          disabled={!isValidUrl || !additionalText.trim() || crawlType === "Select Type"}
        >
          {loading && <div>
            <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline-block mr-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            Processing ...
          </div>
          }
          {!loading && <div>Search</div>}

        </button>
      </form>

      {apiResponse.status && (
        <div className={`mt-5 p-4 rounded-lg ${apiResponse.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {apiResponse.message}
        </div>
      )}

      {apiResponse && (
        <div className="mt-5 grid gap-4 grid-cols-1">
          {apiResponse.results && apiResponse.results.map((result, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md bg-white">{result}</div>
          ))}
        </div>
      )}

    </div>
  );
}