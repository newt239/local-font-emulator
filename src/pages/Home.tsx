import { Button, Center, Flex, Grid, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ArrowClockwise, Play } from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import FontCard from "~/components/FontCard";
import { useFontWorker } from "~/hooks/useFontWorker";
import { fontCacheAtom, fontListAtom, pinnedFontsAtom } from "~/jotai/atoms";
import type { FontData, FontList } from "~/types/FontData";

// キャッシュの有効期限（24時間）
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const HomePage: React.FC = () => {
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const pinnedFonts = useAtomValue(pinnedFontsAtom);
  const [fontList, setFontList] = useAtom(fontListAtom);
  const [fontCache, setFontCache] = useAtom(fontCacheAtom);
  const [visible, handlers] = useDisclosure(false);
  const { parseFont } = useFontWorker();

  const getLocalFonts = useCallback(async () => {
    handlers.open();
    try {
      const fonts: FontData[] = await window.queryLocalFonts();
      const uniqueFonts = Array.from(
        new Map(fonts.map((font) => [font.family, font])).values()
      );

      // バッチサイズを制限してメモリ使用量を抑制
      const BATCH_SIZE = 10;
      const parsedFonts: FontList = [];

      // プログレッシブローディング: バッチごとに処理
      for (let i = 0; i < uniqueFonts.length; i += BATCH_SIZE) {
        const batch = uniqueFonts.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
          batch.map(async (font) => {
            const cacheKey = `${font.family}-${font.style}`;
            const cached = fontCache[cacheKey];
            const now = Date.now();

            // キャッシュが有効な場合はそれを使用
            if (cached && now - cached.timestamp < CACHE_EXPIRY) {
              return {
                family: font.family,
                fullName: font.fullName,
                style: font.style,
                postscriptName: font.postscriptName,
                ja: cached.ja,
              };
            }

            try {
              const blob = await font.blob();
              const arrayBuffer = await blob.arrayBuffer();

              // Web Workerでフォント解析を実行
              const result = await parseFont(
                {
                  family: font.family,
                  fullName: font.fullName,
                  style: font.style,
                  postscriptName: font.postscriptName,
                },
                arrayBuffer
              );

              // キャッシュに保存
              setFontCache((prev) => ({
                ...prev,
                [cacheKey]: { ja: result.ja, timestamp: now },
              }));

              return result;
            } catch {
              const result = {
                family: font.family,
                fullName: font.fullName,
                style: font.style,
                postscriptName: font.postscriptName,
                ja: "undetermind" as const,
              };

              // エラーでもキャッシュに保存
              setFontCache((prev) => ({
                ...prev,
                [cacheKey]: { ja: "undetermind", timestamp: now },
              }));

              return result;
            }
          })
        );

        parsedFonts.push(...batchResults);

        // 中間結果を即座に表示（プログレッシブローディング）
        const currentFiltered = parsedFonts.filter((font) => {
          if (
            query.get("pinned") === "true" &&
            !pinnedFonts.includes(font.family)
          ) {
            return false;
          }
          if (query.get("ja") === "true" && !font?.ja) {
            return false;
          }
          return true;
        });

        const currentSorted = currentFiltered.sort((a, b) => {
          if (a.ja === "supported" && b.ja === "undetermind") return -1;
          if (a.ja === "undetermind" && b.ja === "supported") return 1;
          return 1;
        });

        setFontList([...currentSorted]);

        // 次のバッチの前に少し待機してUIを更新
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      // 最終的なフィルタリングとソート
      const filteredFonts = parsedFonts.filter((font) => {
        if (
          query.get("pinned") === "true" &&
          !pinnedFonts.includes(font.family)
        ) {
          return false;
        }
        if (query.get("ja") === "true" && !font?.ja) {
          return false;
        }
        return true;
      });
      const sortedFonts = filteredFonts.sort((a, b) => {
        if (a.ja === "supported" && b.ja === "undetermind") return -1;
        if (a.ja === "undetermind" && b.ja === "supported") return 1;
        return 1;
      });
      setFontList(sortedFonts);
    } catch {
      alert("フォントの取得に失敗しました");
    }
    handlers.close();
  }, [
    handlers,
    query,
    pinnedFonts,
    setFontList,
    fontCache,
    parseFont,
    setFontCache,
  ]);

  return (
    <>
      {fontList.length === 0 ? (
        <Center>
          <Flex gap={5}>
            {visible && <Loader size="md" c="yellow" />}
            <Button
              c="yellow"
              onClick={getLocalFonts}
              leftSection={<Play size={20} />}
            >
              フォントを取得
            </Button>
          </Flex>
        </Center>
      ) : (
        <>
          <Flex mx={5} justify="end" align="center" gap={5}>
            {visible && <Loader size="md" c="yellow" />}
            <Button
              c="yellow"
              onClick={getLocalFonts}
              leftSection={<ArrowClockwise size="20" />}
              disabled={visible}
            >
              フォントを再取得
            </Button>
          </Flex>
          <Grid m={5}>
            {fontList.map((font) => (
              <Grid.Col
                span={{ lg: 3, md: 4, sm: 6, xs: 12 }}
                key={font.family}
              >
                <FontCard font={font} />
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default HomePage;
