const express = require("express");
const router = express.Router();
const Post = require("../model/postSchema");
const multer = require("multer");
const storage = require("../config/multerStorage");

const upload = multer({
  storage,
});

function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

router.get("/", async (req, res) => {
  console.log(req.query);
  const perPage = 2,
    page = Math.max(0, req.query.page);

  try {
    const posts = await Post.find()
      .limit(perPage)
      .skip(perPage * page)
      .sort("-createdAt");

    const lastpage = posts.length < perPage;

    res.json({ data: posts, metadata: { lastpage } });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errors: [{ message: "Cannot retrieve posts" }],
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).send({
      errors: [
        { message: "Cannot retrieve post with id " + req.params.id },
        { error: err.message },
      ],
    });
  }
});

router.post("/", upload.array("file"), async (req, res) => {
  const { name, description, theme, address } = req.body;
  let filename = "";

  if (req.files.length) filename = req.files[0].filename;

  const data = {
    name,
    description,
    theme,
    address,
    photo: filename,
  };

  const post = new Post(data);

  try {
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message:
            "An error ocurred while saving the post. Stackstrace: " +
            err.message,
        },
      ],
    });
  }
});

router.delete("/:id", async (req, res) => {
  await Post.findByIdAndRemove(req.params.id)
    .then((post) => {
      res.send({ message: `post ${post.name} deleted` });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `An error while deleting post with id ${req.params.id}`,
          },
        ],
      });
    });
});

router.put("/:id", upload.array("file"), async (req, res) => {
  const { name, description, theme, address } = req.body;
  let filename = "";

  if (req.files.length) filename = req.files[0].filename;

  const data = {
    name,
    description,
    theme,
    address,
    photo: filename,
  };

  await Post.findByIdAndUpdate(req.params.id, {
    $set: clean(data),
  })
    .then((post) => {
      res.send({ message: `post ${post.name} updated` });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        errors: [
          {
            message: `An error ocurred while updating post. TraceID: ${req.params.id}`,
          },
        ],
      });
    });
});

module.exports = router;
