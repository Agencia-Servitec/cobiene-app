import { setGlobal } from "reactn";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./router";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles";
import { GlobalStyles } from "./styles/themes/GlobalStyle";
import { yup } from "./config";
import { setLocale } from "yup";
import { useEffect } from "react";
import { FormContact } from "./components";
import { PracticeFormContact } from "./components/ui/PracticeFormContact";

export const App = () => {
  useEffect(() => {
    setGlobal({ visibleFormContact: false });
  }, []);

  setLocale(yup["es"]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router />
        {/*<FormContact />*/}
        <PracticeFormContact />
      </ThemeProvider>
    </BrowserRouter>
  );
};
