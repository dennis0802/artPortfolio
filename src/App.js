import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './routes/home';
import About from './routes/about';
import ArtYear from './routes/artYear';
import Artwork from './routes/artworkIndividual';
import NewArtwork from './routes/newArtwork';

function App() {
  return(
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/artwork" element={<ArtYear yearStart={new Date().getFullYear()}/>}/>
            <Route path="/artwork/:id" element={<Artwork />}/>
            <Route path="/addArtwork" element={<NewArtwork />}/>
            <Route path="/y1" element={<ArtYear yearStart={2019}/>}/>
            <Route path="/y2" element={<ArtYear yearStart={2020}/>}/>
            <Route path="/y3" element={<ArtYear yearStart={2021}/>}/>
            <Route path="/y4" element={<ArtYear yearStart={2022}/>}/>
            <Route path="/y5" element={<ArtYear yearStart={2023}/>}/>
        </Routes>
    </Router>
  )
}

export default App;
