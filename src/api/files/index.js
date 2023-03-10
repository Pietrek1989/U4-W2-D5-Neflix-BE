import Express from "express";
import multer from "multer";
import { getMovies, writeMovies } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";
import { sendsRegistrationEmail } from "../../lib/email-tools.js";
import createHttpError from "http-errors";

const filesRouter = Express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "moviesPosters",
    },
  }),
}).single("poster");

filesRouter.post(
  "/:movieId/movieSingle",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);
      const moviesArray = await getMovies();
      const index = moviesArray.findIndex(
        (movie) => movie.imdbID === req.params.movieId
      );
      if (index !== -1) {
        const oldMovie = moviesArray[index];
        const updatedMovie = {
          ...oldMovie,
          poster: `${req.file.path}`,
        };
        moviesArray[index] = updatedMovie;
        await writeMovies(moviesArray);
        res.send({ updatedMovie, message: "file uploaded" });
      } else {
        next(
          createHttpError(404, `movie with id ${req.params.movieId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.get("/:movieId/pdf", async (req, res, next) => {
  try {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${req.params.movieId}.pdf`
    );
    const movieArray = await getMovies();
    const index = movieArray.findIndex(
      (movie) => movie.imdbID === req.params.movieId
    );
    if (index !== -1) {
      const targetedMovie = movieArray[index];

      const source = await getPDFReadableStream(targetedMovie);
      const destination = res;

      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    } else {
      next(
        createHttpError(404, `movie with id ${req.params.movieId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

filesRouter.post("/email", async (req, res, next) => {
  try {
    // 1. Receive user's data in req.body
    const { email } = req.body;
    // 2. Save him/her in db
    // 3. Send email to new user
    await sendsRegistrationEmail(email);
    res.send({ message: "email sent to" + email });
  } catch (error) {
    next(error);
  }
});

filesRouter.get("/csv", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=movies.csv");
    const source = geMoviesJSONReadableStream();
    const transform = new Transform({ fields: ["name", "surname", "email"] });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
