import Tesseract from "tesseract.js"

export async function extractTextFromImage(imagePath) {
  return Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  }).then(({ data: { text } }) => {
    console.log(text);
    return text;
  });
}
