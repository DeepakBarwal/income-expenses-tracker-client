import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([]);

function App() {
  return (
    <RouterProvider router={router}>
      <div>
        <h1 className="text-green-800">Income-Expenses Tracker</h1>
      </div>
    </RouterProvider>
  );
}

export default App;
