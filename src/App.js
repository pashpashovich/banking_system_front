import React from 'react';
import MainPage from "./pages/mainPage/MainPage";
import RegisterPage from "./pages/Register/AuthPage";
import LoginPage from "./pages/Login/Login"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/PersonalPage/ProfilePage';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import ClientsAccountPage from './pages/ClientsAccountPage/ClientsAccountPage';
import EditClietnPage from './pages/EditClient/EditClient';
import AccountTransactionsPage from './pages/AccountTransactions/AccountTransactionsPage';
import Analytics from "./pages/Analytics/alalytics";
import TransactionsReport from "./pages/Reports/accountReport";
import TransactionsReportDir from "./pages/Reports/accountReportDir";
import Forbidden from './pages/forbidden/forbidden'
import DirectorProfilePage from './pages/directorProfilePage/directorProfilePage'
import DirectorUser from './pages/manageUsers/manageUsers'
import ClientProfilePage from './pages/clientProfile/ClientProfile';
import ClientsAccPage from './pages/ClientsProfileAccs/clientsAccs';
import ClientsAccTrPage from './pages/ClientAccsTransactions/clientAccsTransactions';
import ClientReportPage from './pages/userReportPage/userReportPage'






function App() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}></Route>
                <Route path="/reg" element={<RegisterPage/>}></Route>
                <Route path="/login" element={<LoginPage/>}></Route>
                <Route path="/profile/:userID" element={<ProfilePage/> }></Route>
                <Route path="/profileDir/:userID" element={<DirectorProfilePage/> }></Route>
                <Route path="/profileCl/:userID" element={<ClientProfilePage/> }></Route>
                <Route path="/ClAccs/:userID" element={<ClientsAccPage/> }></Route>
                <Route path="/ClAccs/:accountID/:userID" element={<ClientsAccTrPage/> }></Route>
                <Route path="/director/users/:userID" element={<DirectorUser/> }></Route>
                <Route path="/director/reports/:userID" element={<TransactionsReportDir/> }></Route>
                <Route path="/data/:userID" element={<ClientsPage/>}></Route>
                <Route path="/login/client/:clientId/:userID" element={<ClientsAccountPage />} />
                <Route path="/client/edit/:clientId/:userID" element={<EditClietnPage />} />
                <Route path="/client/reports/:userID" element={<ClientReportPage />} />
                <Route path="/account/:accountID/:userID" element={<AccountTransactionsPage />} />
                <Route path="/analytics/:userID" element={<Analytics/>} />
                <Route path="/analysis/:userID" element={<TransactionsReport/>} />
                <Route path="/forbidden" element={<Forbidden />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
