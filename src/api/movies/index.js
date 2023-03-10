import Express from "express";
import uniqid from "uniqid";
import { getMovies, writeMovies } from "../../lib/fs-tools.js";
import createHttpError from "http-errors";
import { checkMoviesSchema, triggerBadRequest } from "./validation.js";

const moviesRouter = Express.Router();

moviesRouter.post(
  "/",
  // checkMoviesSchema,
  // triggerBadRequest,
  async (request, response, next) => {
    try {
      const moviesArray = await getMovies();
      const newMovie = {
        ...request.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        imdbID: uniqid(),
      };
      const alreadyTitle = moviesArray.find(
        (movie) => movie.title === request.body.title
      );
      if (alreadyTitle) {
        response
          .status(400)
          .send("Title already exist, please pick different one");
        return;
      }
      moviesArray.push(newMovie);
      await writeMovies(moviesArray);

      response.status(201).send({ imdbID: newMovie.imdbID });
    } catch (error) {
      next(error);
    }
  }
);

moviesRouter.get("/", async (request, response, next) => {
  try {
    const moviesArray = await getMovies();
    if (request.query && request.query.category) {
      const filteredMovies = moviesArray.filter(
        (movie) => movie.category === request.query.category
      );
      response.send(filteredMovies);
    } else {
      response.send(moviesArray);
    }
  } catch (error) {
    next(error);
  }
});

moviesRouter.get("/:movieId", async (request, response, next) => {
  try {
    const moviesArray = await getMovies();
    const movie = moviesArray.find(
      (movie) => movie.imdbID === request.params.movieId
    );
    if (movie) {
      response.send(movie);
    } else {
      next(
        createHttpError(
          404,
          `movies with id ${request.params.movieId} not found!`
        )
      );
    }
    response.send(movie);
  } catch (error) {
    next(error);
  }
});

moviesRouter.put("/:movieId", async (request, response, next) => {
  try {
    const moviesArray = await getMovies();
    const index = moviesArray.findIndex(
      (movie) => movie.imdbID === request.params.movieId
    );
    if (index !== -1) {
      const oldMovie = moviesArray[index];
      const updatedMovie = {
        ...oldMovie,
        ...request.body,
        updatedAt: new Date(),
      };
      moviesArray[index] = updatedMovie;
      await writeMovies(moviesArray);
      response.send(updatedMovie);
    } else {
      next(
        createHttpError(
          404,
          `movie with id ${request.params.movieId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

moviesRouter.delete("/:movieId", async (request, response, next) => {
  try {
    const moviesArray = await getMovies();
    const remainingMovies = moviesArray.filter(
      (movie) => movie.imdbID !== request.params.movieId
    );
    if (moviesArray.length !== remainingMovies.length) {
      await writeMovies(remainingMovies);
      response.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `movie with id ${request.params.movieId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default moviesRouter;
