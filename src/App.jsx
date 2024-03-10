
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar"
import Popular from "./Popular"
import Story from "./Story"
import AllStories from "./AllStories"

function App() {
  return (
    <div className="header">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Story />} />
          {/* dedicated pages for each categories */}
          <Route path="/allstories/:category" element={<AllStories />} />     
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App



