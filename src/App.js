import React, { useEffect, Component } from 'react';
import { Router, Location, Redirect } from '@reach/router';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WalletBar from './components/WalletBar';
import { ThemeProvider } from './context/ThemeContext';
import WalletConnectProvider from './context/WalletConnectProvider';
import Exchange from './pages/exchange';
import Swap from './pages/swap';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const ScrollToTop = ({ children, location }) => {
  useEffect(() => window.scrollTo(0, 0), [location])
  return children
}

export default class App extends Component {
  state = {
    theme: 'dark',
  };
  render() {
    return (
      <>
        <WalletConnectProvider>
          <ThemeProvider
            value={{
              data: this.state,
              update: () => {
                this.setState((state) => ({
                  theme:
                    state.theme === 'light'
                      ? (this.theme = 'dark')
                      : (this.theme = 'light'),
                }));
              },
            }}
          >
            <Header />
            <Sidebar />
            <WalletBar />
            <PosedRouter>
              <ScrollToTop path="/">
                <Exchange exact path="/">
                  <Redirect to="/" />
                </Exchange>
                <Exchange path="exchange" />
                <Swap path="swap" />
              </ScrollToTop>
            </PosedRouter>
          </ThemeProvider >
          <ToastContainer />
        </WalletConnectProvider>
      </>
    );
  }
}
