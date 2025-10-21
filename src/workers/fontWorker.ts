// Web Worker for font parsing
import opentype from "opentype.js";

export interface FontWorkerMessage {
  type: 'PARSE_FONT';
  data: {
    fontData: {
      family: string;
      fullName: string;
      style: string;
      postscriptName: string;
    };
    blob: ArrayBuffer;
  };
}

export interface FontWorkerResponse {
  type: 'FONT_PARSED';
  data: {
    family: string;
    fullName: string;
    style: string;
    postscriptName: string;
    ja: "supported" | "undetermind";
  };
}

self.onmessage = async (event: MessageEvent<FontWorkerMessage>) => {
  const { type, data } = event.data;
  
  if (type === 'PARSE_FONT') {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const fontData = opentype.parse(data.blob);
      let jaSupport: "supported" | "undetermind" = "undetermind";
      
      if (fontData.supported) {
        const glyph_あ = fontData.charToGlyphIndex("あ");
        if (glyph_あ !== 0) {
          jaSupport = "supported";
        }
      }
      
      const response: FontWorkerResponse = {
        type: 'FONT_PARSED',
        data: {
          family: data.fontData.family,
          fullName: data.fontData.fullName,
          style: data.fontData.style,
          postscriptName: data.fontData.postscriptName,
          ja: jaSupport,
        }
      };
      
      self.postMessage(response);
    } catch {
      const response: FontWorkerResponse = {
        type: 'FONT_PARSED',
        data: {
          family: data.fontData.family,
          fullName: data.fontData.fullName,
          style: data.fontData.style,
          postscriptName: data.fontData.postscriptName,
          ja: "undetermind",
        }
      };
      
      self.postMessage(response);
    }
  }
};
