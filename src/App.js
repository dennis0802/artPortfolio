import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './routes/home';
import About from './routes/about';
import ArtYear from './routes/artYear';
import Artwork from './routes/artworkIndividual';
import NewArtwork from './routes/newArtwork';
import LoginPage from './routes/login';
import LogoutPage from './routes/logout';
import CreateAccount from './routes/createAccount';
import NotAuthenticated from './routes/notAuthenticated';
import AccountPage from './routes/account';
import Users from './routes/users';
import RecoveryPage from './routes/recoverPassword';
import ErrorPage from './routes/error';
import ResetPage from './routes/resetPassword';
import RegistrationPage from './routes/completeRegistration';

function App() {
  return(
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/artwork/:id" element={<Artwork />}/>
            <Route path="/addArtwork" element={<NewArtwork />}/>
            <Route path="/y1" element={<ArtYear yearStart={2019} subId={1}/>}/>
            <Route path="/y2" element={<ArtYear yearStart={2020} subId={2}/>}/>
            <Route path="/y3" element={<ArtYear yearStart={2021} subId={3}/>}/>
            <Route path="/y4" element={<ArtYear yearStart={2022} subId={4}/>}/>
            <Route path="/y5" element={<ArtYear yearStart={2023} subId={5}/>}/>
            <Route path="/y6" element={<ArtYear yearStart={new Date().getFullYear()} subId={6}/>}/>
            <Route path="/login" element={<LoginPage />}/> 
            <Route path="/account" element={<AccountPage subId={1}/>}/>
            <Route path="/logout" element={<LogoutPage subId={2}/>}/>
            <Route path="/createAccount" element={<CreateAccount />}/>
            <Route path="/notAuthenticated" element={<NotAuthenticated />}/>
            <Route path="/recoverPassword" element={<RecoveryPage />}/>
            <Route path="/users" element={<Users />}/>
            <Route path="/reset/:token" element={<ResetPage />}/>
            <Route path="/confirmAccount/:token" element={<RegistrationPage />}/>
            <Route path="*" element={<ErrorPage/>}/>
        </Routes>
    </Router>
  )
}

export default App;
