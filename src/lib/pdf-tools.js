import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

export const getPDFReadableStream = async (movie) => {
  // Define font files
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  const imageEncoded = await imageToBase64(movie.poster);

  const docDefinition = {
    content: [
      {
        style: "tableExample",
        table: {
          body: [
            ["Title", "Category", "Type", "Last Updated"],
            [movie.title, movie.category, movie.type, movie.updatedAt],
          ],
        },
      },

      {
        image: `data:image/jpeg;base64,${imageEncoded}`,
        width: 400,
      },
    ],

    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};

// export const asyncPDFGeneration = async file => {

//   const source = getPDFReadableStream(file)

//   const promiseBasedPipeline = promisify(pipeline)

//   await promiseBasedPipeline(source, destination)
//   return destination
// }
