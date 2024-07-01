import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/dashboard/Dashboard";
import Home from "./Components/dashboard/Home";
import Invoices from "./Components/dashboard/Invoices";
import NewInvoice from "./Components/dashboard/NewInvoice";
import Settings from "./Components/dashboard/Settings";
import InvoiceDetails from './Components/dashboard/InvoiceDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="new-invoice" element={<NewInvoice />} />
          <Route path="settings" element={<Settings />} />
          <Route path="invoice-details" element={<InvoiceDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
