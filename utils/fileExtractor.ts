
// Make TypeScript aware of the global libraries loaded from CDN
declare const pdfjsLib: any;
declare const mammoth: any;

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileType = file.type;
    const reader = new FileReader();

    if (fileType === 'application/pdf') {
      reader.onload = async (event) => {
        try {
          const pdfData = new Uint8Array(event.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          const numPages = pdf.numPages;
          let fullText = '';
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // .docx
      reader.onload = async (event) => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: event.target?.result });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else { // HTML or other text-based files
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    }
  });
};
