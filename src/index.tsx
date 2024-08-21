import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <RecoilRoot>
    <CssBaseline />
    <Router>
      <SnackbarProvider maxSnack={3}>
        <TonConnectUIProvider manifestUrl="https://miniapp.slerf.tools/tonconnect-manifest.json">
          <App />
        </TonConnectUIProvider>
      </SnackbarProvider>
    </Router>
  </RecoilRoot>,
);

reportWebVitals();
