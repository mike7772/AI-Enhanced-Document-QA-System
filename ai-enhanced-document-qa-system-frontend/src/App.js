import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage"

function App() {
  return (
    <div className="bg-general_bg m-0 w-full h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

const NotFound = () => {
  return (
    <div className=" flex flex-col gap-0 w-full h-full align-center justify-center">
      <div className="mt-0 text-center">
        <h3 className=" text-6xl font-bold ">404</h3>
        <p className=" text-xl">Page not found!</p>
      </div>
    </div>
  );
};
