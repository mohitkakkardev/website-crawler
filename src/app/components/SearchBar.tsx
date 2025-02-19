import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative max-w-lg mx-auto mt-10">
      <input
        type="text"
        placeholder="Enter domain"
        className="w-full px-5 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <Search className="absolute right-4 top-3 text-gray-400" />
    </div>
  );
}
