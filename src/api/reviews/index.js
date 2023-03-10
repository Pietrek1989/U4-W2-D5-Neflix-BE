import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkReviewsSchema, triggerBadRequest } from "./validation.js";
import { getMovies, getReviews, writeReviews } from "../../lib/fs-tools.js";

const reviewsRouter = Express.Router();

reviewsRouter.post(
  "/:movieId",
  checkReviewsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const movieArray = await getMovies();
      const index = movieArray.findIndex(
        (movie) => movie.imdbID === req.params.movieId
      );
      if (index !== -1) {
        const newReview = {
          ...req.body,
          elementId: req.params.movieId,
          id: uniqid(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const reviewArray = await getReviews();
        reviewArray.push(newReview);
        await writeReviews(reviewArray);

        res.status(201).send({ id: newReview.id });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

reviewsRouter.get("/:movieId", async (req, res, next) => {
  try {
    const reviewArray = await getReviews();

    const filteredReviews = reviewArray.filter(
      (review) => review.elementId === req.params.movieId
    );
    if (filteredReviews !== reviewArray) {
      res.send(filteredReviews);
    } else {
      next(
        createHttpError(404, `product with id ${req.params.movieId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:movieId/:reviewId", async (req, res, next) => {
  try {
    const reviewArray = await getReviews();

    const chosenReview = reviewArray.find(
      (review) => review.id === req.params.reviewId
    );
    if (chosenReview) {
      res.send(chosenReview);
    } else {
      next(
        createHttpError(404, `review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put(
  "/:movieId/:reviewId",
  checkReviewsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const reviewArray = await getReviews();
      const index = reviewArray.findIndex(
        (review) => reviewmovie.id === req.params.reviewId
      );
      if (index !== -1) {
        const oldReview = reviewArray[index];
        const newReview = {
          ...oldReview,
          ...req.body,
          updatedAt: new Date(),
        };
        reviewArray[index] = newReview;
        await writeReviews(reviewArray);
        res.send(newReview);
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

export default reviewsRouter;
