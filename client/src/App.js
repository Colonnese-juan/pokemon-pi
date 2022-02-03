import "./App.css";
import { Route, BrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/Home" component={Home} />
    </BrowserRouter>
  );
}

export default App;
