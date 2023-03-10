import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const moviesSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  year: {
    in: ["body"],
    isInt: {
      errorMessage: "year is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage:
        "cattegory is a mandatory field and needs to be a link in string format!",
    },
  },
  poster: {
    in: ["body"],
    isString: {
      errorMessage:
        "poster is a mandatory field and needs to be a link in string format!",
    },
  },
};

export const checkMoviesSchema = checkSchema(moviesSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  }
};
