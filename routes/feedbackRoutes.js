const express = require("express");
const feedBackRouter = express.Router();
const Feedback = require("../models/feedback");
const Article = require("../models/articles");

feedBackRouter.get("/:id", (req, res) => {
  console.log(req.params.id);
  Feedback.findOne({ _id: req.params.id }).then((data) => {
    console.log(data);
    res.send(data);
  });
});

feedBackRouter.post("/", async (req, res) => {
  const data = await Feedback.create({ ...req.body });

  const articleId = data.articleId;
  const rating = req.body.rating;
  console.log(rating);
  if (!articleId || rating === null || rating === undefined) {
    res.end();
    return;
  }

  const article = await Article.findOne({ _id: articleId });

  const numRatings = Number((article.numRatings ? article.numRatings : 0) + 1);

  const avgRatingOld = article.avgRating ? Number(article.avgRating) : 0;

  const avgRating = (avgRatingOld * (numRatings - 1) + rating) / numRatings;

  console.log(
    numRatings,
    " ",
    avgRatingOld,
    " ",
    numRatings - 1,
    " ",
    avgRatingOld * (numRatings - 1) + rating,
  );

  const patchResponse = await Article.findOneAndUpdate(
    { _id: articleId },
    { numRatings, avgRating },
  );

  res.send(data);
});

module.exports = feedBackRouter;
