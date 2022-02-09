import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './components/signup.component/signup.component';
import Vault from './components/Vault/vault.component';
import Settings from './components/Settings.component/Settings.component';
import AuthenticateUser from './components/auth.component/auth.component';
import store from './redux/store';
import './index.css';
import './App.css'

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App/>}>
      <Route path="sign-in" element={<AuthenticateUser/>}/>
    <Route path="sign-up" element={<Signup/>}/>
    <Route path="vault" element={<Vault/>}/>
    <Route exact='true' path="settings" element={<Settings/>}/>
    </Route>
  </Routes>
    </BrowserRouter>
    </Provider>
    ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
