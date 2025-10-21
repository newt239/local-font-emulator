import { useCallback, useEffect, useRef } from 'react';
import type { FontWorkerMessage, FontWorkerResponse } from '~/workers/fontWorker';

export const useFontWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const pendingTasks = useRef<Map<string, (result: { family: string; fullName: string; style: string; postscriptName: string; ja: "supported" | "undetermind" }) => void>>(new Map());

  useEffect(() => {
    // Web Workerを初期化
    workerRef.current = new Worker(
      new URL('../workers/fontWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event: MessageEvent<FontWorkerResponse>) => {
      const { type, data } = event.data;
      
      if (type === 'FONT_PARSED') {
        const taskId = `${data.family}-${data.style}`;
        const resolve = pendingTasks.current.get(taskId);
        if (resolve) {
          resolve(data);
          pendingTasks.current.delete(taskId);
        }
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const parseFont = useCallback(async (
    fontData: { family: string; fullName: string; style: string; postscriptName: string },
    blob: ArrayBuffer
  ): Promise<{ family: string; fullName: string; style: string; postscriptName: string; ja: "supported" | "undetermind" }> => {
    return new Promise((resolve) => {
      const taskId = `${fontData.family}-${fontData.style}`;
      pendingTasks.current.set(taskId, resolve);

      const message: FontWorkerMessage = {
        type: 'PARSE_FONT',
        data: { fontData, blob }
      };

      workerRef.current?.postMessage(message);
    });
  }, []);

  return { parseFont };
};
