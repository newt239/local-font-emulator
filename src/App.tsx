import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";

import ScrollTop from "~/components/ScrollTop";
import Wrapper from "~/components/Wrapper";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <MantineProvider theme={{ fontFamily: "system-ui" }}>
        <Wrapper />
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
