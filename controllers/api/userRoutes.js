const router = require("express").Router();
const { User } = require("../../models");
const { getAttributes } = require("../../models/User");
const withAuth = require("../../utils/auth");

//create new user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get("/profile", async (req, res) => {
  const names = await User.findAll({
    where: { hasBeenChosen: false },
    attributes: { exclude: ["password"] },
  });

  const currentUser = req.session.user_id;

  if (!currentUser) {
    return res.json({ message: "Must be signed in!" });
  }
  const userRemoved = names.filter((user) => user.id !== currentUser);

  const chosenPerson =
    userRemoved[Math.floor(Math.random() * userRemoved.length)];
  console.log(userRemoved);
  if(!userRemoved.length ){
    return res.json({ message: "All users have been chosen" });
  }
  const updatedCurrentUser = await User.update(
    {
      chosenPerson: chosenPerson.id,
    },
    {
      where: { id: currentUser},
    }
  )
  const updatedUser = await User.update(
    {
      hasBeenChosen: true,
    },
    {
      where: { id: chosenPerson.id },
    }
  );
  console.log(updatedCurrentUser)
  res.json(chosenPerson);
});

module.exports = router;
