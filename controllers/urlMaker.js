const Link = require("../models/Link");
const Counter = require("../models/Counter");

const urlShortner = async (req, res) => {
  try {
    const longUrl = req.body.longUrl;

    const str = "gT5mQaZ1xR8vN2kLpY9cW3sDfH7jU4iBoE6nX0tKzVwPqA";

    // Get current counter and increase it atomically
    const counter = await Counter.findOneAndUpdate(
      {},
      { $inc: { value: 1 } },
      { new: true, upsert: true },
    );

    let p = counter.value;
    let finalStr = "";

    // Convert counter to Base62
    while (p >= 1) {
      const i = p % 62;
      finalStr += str[i];
      p = Math.floor(p / 62);
    }

    // Save link
    const data = {
      user: req.user._id,
      longLink: longUrl,
      shortLink: finalStr,
    };

    const link = await Link.create(data);

    res.status(201).json({
      message: "URL shortened successfully",
      data: link.shortLink,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const allLink = async (req, res) => {
  try {
    const data = await Link.find({ user: req.user._id });
    res.status(200).json({
      message: `you have ${data.length} links`,
      length: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "There no data",
    });
  }
};

const urlRedirect = async (req, res) => {
  try {
    const { shortLink } = req.params;

    const url = await Link.findOne({ shortLink });

    if (!url) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(url.longLink);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

module.exports = {
  urlShortner,
  allLink,
  urlRedirect,
};
