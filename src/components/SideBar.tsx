import {
  ActionIcon,
  Anchor,
  Flex,
  Paper,
  SegmentedControl,
  Slider,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { GithubLogo } from "@phosphor-icons/react";
import { useAtom } from "jotai";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { fontSizeAtom, textAtom } from "~/jotai/atoms";

export function SideBar() {
  const { search, pathname } = useLocation();
  const query = new URLSearchParams(search);
  const navigate = useNavigate();

  const [text, setText] = useAtom(textAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);

  return (
    <Paper
      w={300}
      p="md"
      h="100vh"
      style={{ position: "fixed", left: 0, top: 0 }}
    >
      <Stack gap="md" h="100%">
        <Stack gap="md">
          <Link to="/">
            <Title
              order={1}
              style={{
                lineHeight: 1,
              }}
            >
              Local Font Emulator
            </Title>
          </Link>

          <Textarea
            placeholder="Type something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Stack>

        <Stack gap="md" style={{ flex: 1 }}>
          <Text size="xs" fw={500} c="dimmed">
            フォントサイズ
          </Text>
          <Slider value={fontSize} onChange={setFontSize} min={5} max={50} />
          <Text size="xs" fw={500} c="dimmed">
            フィルター
          </Text>
          <SegmentedControl
            disabled={pathname.includes("font")}
            data={[
              { value: "all", label: "すべて" },
              { value: "pinned", label: "お気に入り" },
            ]}
            onChange={(value) => {
              if (value === "all") {
                query.delete("pinned");
                navigate({ search: query.toString() });
              } else if (value === "pinned") {
                query.set("pinned", "true");
                navigate({ search: query.toString() });
              }
            }}
            fullWidth
          />

          <Text size="xs" fw={500} c="dimmed">
            和文フォント
          </Text>
          <SegmentedControl
            disabled={pathname.includes("font")}
            data={[
              { value: "all", label: "すべて" },
              { value: "ja", label: "和文のみ" },
            ]}
            onChange={(value) => {
              if (value === "all") {
                query.delete("ja");
                navigate({ search: query.toString() });
              } else if (value === "ja") {
                query.set("ja", "true");
                navigate({ search: query.toString() });
              }
            }}
            fullWidth
          />
        </Stack>

        <Stack gap="xs">
          <Link to="/privacy">
            <Anchor component="span" size="sm">
              プライバシーポリシー
            </Anchor>
          </Link>
          <Flex justify="space-between" align="center">
            <Text>
              © 2023-2025{" "}
              <Anchor href="https://twitter.com/newt239" target="_blank">
                newt239
              </Anchor>
            </Text>
            <ActionIcon
              component="a"
              href="https://github.com/newt239/local-font-emulator"
              variant="subtle"
              target="_blank"
              c="dark"
              size="lg"
            >
              <GithubLogo size={20} />
            </ActionIcon>
          </Flex>
        </Stack>
      </Stack>
    </Paper>
  );
}
