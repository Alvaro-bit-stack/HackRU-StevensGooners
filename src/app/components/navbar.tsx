export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="w-full px-6 py-6 flex items-center justify-between">
        <a href="/" className="text-3xl font-bold hover:text-gray-300 transition-colors">
          BAMM Project
        </a>
        <div className="flex space-x-8 text-lg font-bold">
          <a href="/" className="hover:text-gray-300 transition-colors duration-200">Home</a>
          <a href="/grades" className="hover:text-gray-300 transition-colors duration-200">Get Grades</a>
          <a href="/study" className="hover:text-gray-300 transition-colors duration-200">Study</a>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200">Creator-Contacts</a>
          <a href="/extension" className="hover:text-gray-300 transition-colors duration-200">Download Extension</a>
        </div>
      </div>
    </nav>
  );
}