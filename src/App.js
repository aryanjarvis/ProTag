import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// styles
import './App.css'

// pages & components
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Project from './pages/project/Project'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import OnlineUsers from './components/OnlineUsers'
import Mentor from './pages/mentor/Mentor'
import Profile from './pages/profile/Profile'
import Mentorprofile from './pages/mentor/mentorprofile'
import ProjectHome from './pages/project_home/ProjectHome'
import Code from './pages/codepair/Code'
import CodeEditor from './pages/codepair/codeide'
import Getresource from './pages/resource/Resource'

function App() {
  const { authIsReady, user } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Switch>
              <Route exact path="/">
                {!user && <Redirect to="/login" />}
                {user && <Dashboard />}
              </Route>   
              <Route exact path="/codeide">
                {!user && <Redirect to="/login" />}
                {user && <CodeEditor />}
              </Route>   
              <Route path="/codepair">
                {!user && <Redirect to="/login" />}
                {user && <Code />}
              </Route>    
                 
              <Route path="/mentor">
                {!user && <Redirect to="/login" />}
                {user && <Mentor />}
              </Route>    

              <Route path="/resource">
                {!user && <Redirect to="/login" />}
                {user && <Getresource />}
              </Route>   
              <Route path="/project_home">
                {!user && <Redirect to="/login" />}
                {user && <ProjectHome />}
              </Route>             
              <Route path="/profile">
                {!user && <Redirect to="/login" />}
                {user && <Profile />}
              </Route>
              <Route path="/create">
                {!user && <Redirect to="/login" />}
                {user && <Create />}
              </Route>
              <Route path="/projects/:id">
                {!user && <Redirect to="/login" />}
                {user && <Project />}
              </Route>
              <Route path="/mentors/:id">
                {!user && <Redirect to="/login" />}
                {user && <Mentorprofile />}
              </Route>
              <Route path="/login">
                {user && <Redirect to="/" /> }
                {!user && <Login /> }
              </Route>
              <Route path="/signup">
                {user && user.displayName && <Redirect to="/" /> }
                {!user && <Signup /> }
              </Route>
            </Switch>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
