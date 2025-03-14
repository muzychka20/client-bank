import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-section">
      <section className="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        <div className="py-12 px-6 mx-auto max-w-screen-xl text-center lg:py-20">
          <div className="mx-auto max-w-md">
            <h1 className="bg-blue-600 mb-6 text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 dark:from-red-400 dark:to-red-700">
              404
            </h1>
            <p className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Oops! Page not found.
            </p>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
              Sorry, we can’t find that page. You can go back to the homepage
              and continue browsing.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Go Home
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFound;
