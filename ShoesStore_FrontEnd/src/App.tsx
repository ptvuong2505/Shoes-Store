import "./App.css";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <main className="p-15">
        <Outlet />
      </main>
    </>
  );
}

export default App;
