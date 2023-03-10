import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createReadStream } from "fs";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../api/data"
);
const moviesJSONPath = join(dataFolderPath, "movies.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getMovies = () => readJSON(moviesJSONPath);
export const writeMovies = (moviesArray) =>
  writeJSON(moviesJSONPath, moviesArray);
export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray);

// export const saveAuthorsAvatars = (fileName, fileContentAsBuffer) =>
//   writeFile(join(usersPublicFolderPath, fileName), fileContentAsBuffer);
// export const saveArticlePic = (fileName, fileContentAsBuffer) =>
//   writeFile(join(reviewsPublicFolderPath, fileName), fileContentAsBuffer);

export const geMoviesJSONReadableStream = () =>
  createReadStream(moviesJSONPath);

export const getPDFWritableStream = (filename) =>
  createWriteStream(join(dataFolderPath, filename));
