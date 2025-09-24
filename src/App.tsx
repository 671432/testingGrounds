import "./App.css"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

// Auto-import all index.tsx files in projects/*
const modules = import.meta.glob("./projects/*/*.tsx", { eager: true }) //any file of type ".tsx" will be listed in the navbar

// Build a list of projects
const projects = Object.entries(modules).map(([path, module]) => {
  const name = path.split("/")[2] // folder name (e.g., "mouseMovement")
  return {
    name,
    Component: (module as any).default,
  }
})

export default function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav>
          {projects.map((p) => (
            <Link
              key={p.name}
              to={`/${p.name}`}
            >
              {p.name}
            </Link>
          ))}
        </nav>

        {/* Routes */}
        <main>
          <Routes>
            {projects.map((p) => (
              <Route
                key={p.name}
                path={`/${p.name}`}
                element={<p.Component />}
              />
            ))}
            {/* Default route */}
            <Route path="*" element={<p>Select a project from the navbar.</p>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
