import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Feeds from "./Components/Feeds";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import { AuthContext } from "./context/AuthProvider";

function App() {
  let { currentUser } = useContext(AuthContext);

  return ( 
    // Conditional Routing - can access profile and feed page only when logged in
    <Router>
      <div className="App">
        <Switch>
          {currentUser ? (
            <>
              <Route path="/" component={Feeds} exact></Route>
              <Route path="/profile" component={Profile} exact></Route>
              <Redirect to="/"></Redirect>
            </>
          ) : (
            <>
              <Route path="/login" component={Login} exact></Route>
              <Route path="/signup" component={Signup} exact></Route>
              <Redirect to="/login"></Redirect>
            </>
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;