import QRCode from "qrcode";

export async function generateQrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#1a1714",
      light: "#ffffff",
    },
  });
}

export async function generateQrDataUrl(text: string, width = 600): Promise<string> {
  return QRCode.toDataURL(text, {
    width,
    margin: 2,
    color: {
      dark: "#0f0e0c",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });
}
