export default function ContactPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Contact Me</h1>
          <p className="text-gray-600 mb-4">Feel free to reach out via the following platforms:</p>
          
          <div className="space-y-4">
            <a href="mailto:shivamsahu2635@gmail.com" className="block text-blue-500 hover:underline">
              📧 Email: shivamsahu2635@gmail.com
            </a>
            <a href="https://github.com/shivamsahu-tech" target="_blank" className="block text-blue-500 hover:underline">
              🔗 GitHub: github.com/shivamsahu-tech
            </a>
            <a href="https://linkedin.com/in/shsax" target="_blank" className="block text-blue-500 hover:underline">
              🔗 LinkedIn: linkedin.com/in/shsax
            </a>
          </div>
        </div>
      </div>
    );
  }
  