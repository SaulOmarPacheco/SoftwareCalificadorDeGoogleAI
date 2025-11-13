
// This assumes pdfjsLib is available globally from the script tag in index.html
declare const pdfjsLib: any;

/**
 * Extracts text content from a PDF file.
 * @param file The PDF file object.
 * @returns A promise that resolves with the extracted text as a string.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }

      try {
        const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const numPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        resolve(fullText);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(new Error("Could not parse the PDF file. It might be corrupted or in an unsupported format."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Error reading file."));
    };

    fileReader.readAsArrayBuffer(file);
  });
}
