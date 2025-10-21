import { Anchor, Box, Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Route, Routes } from "react-router-dom";

import { SideBar } from "~/components/SideBar";
import FontPage from "~/pages/Font";
import HomePage from "~/pages/Home";
import PrivacyPage from "~/pages/Privacy";

const Wrapper = () => {
  const matches = useMediaQuery("(min-width: 30em)");
  return (
    <>
      {matches ? (
        <Flex>
          <SideBar />
          <Box
            style={{
              marginLeft: 300,
              width: "calc(100vw - 300px)",
              minHeight: "100vh",
              backgroundColor: "hsl(45,10%, 90%)",
              padding: "1rem",
            }}
          >
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
                <Route path="font">
                  <Route path=":fontFamily" element={<FontPage />} />
                </Route>
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
          </Box>
        </Flex>
      ) : (
        <Box p="md">
          <Text>
            本アプリケーションはデスクトップのブラウザでのみ動作します。対応ブラウザの詳細は
            <Anchor
              href="https://caniuse.com/mdn-api_window_querylocalfonts"
              target="_blank"
            >
              Window API: queryLocalFonts | Can I use
            </Anchor>
            をご確認ください。
          </Text>
        </Box>
      )}
    </>
  );
};

export default Wrapper;
