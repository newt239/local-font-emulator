import { Flex, Paper, ScrollArea, Switch, Text } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { Link } from "react-router-dom";

import { fontSizeAtom, pinnedFontsAtom, textAtom } from "~/jotai/atoms";
import type { FontList } from "~/types/FontData";

type FontCardProps = {
  font: FontList[number];
};

const FontCard: React.FC<FontCardProps> = ({ font }) => {
  const text = useAtomValue(textAtom);
  const fontSize = useAtomValue(fontSizeAtom);
  const [pinnedFonts, setPinnedFonts] = useAtom(pinnedFontsAtom);

  return (
    <Paper shadow="xs" p="md" w="100%">
      <Flex align="center" justify="space-between">
        <Link to={`/font/${font.family}`}>
          <p>{font.family}</p>
        </Link>
        <Switch
          c="yellow"
          checked={pinnedFonts.includes(font.family)}
          onChange={(e) => {
            if (e.target.checked) {
              setPinnedFonts([...pinnedFonts, font.family]);
            } else {
              setPinnedFonts(
                pinnedFonts.filter((afont) => afont !== font.family)
              );
            }
          }}
        />
      </Flex>
      <ScrollArea h="20vh" w="100%" offsetScrollbars>
        <Text
          fz="lg"
          style={{
            fontFamily: `'${font.family}', Tofu`,
            fontSize,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </Text>
      </ScrollArea>
    </Paper>
  );
};

export default FontCard;
