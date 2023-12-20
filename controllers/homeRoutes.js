const router = require('express').Router();
const { Item, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const itemData = await User.findAll({
     attributes: {exclude : ['password']}
    });

    // Serialize data so the template can read it
    const users = itemData.map((user) => user.get({ plain: true }));
console.log(users);
    // Pass serialized data and session flag into template
    res.render('homepage', { 
       
        users, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//error no handlebars exist
router.get('/item/:id', async (req, res) => {
  try {
    const itemData = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const item = itemData.get({ plain: true });

    res.render('item', {
      ...item,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Item }],
    });

    const chosenPersonData = await User.findByPk(userData.chosenPerson, {
      attributes: { exclude: ['password'] },
    });
console.log(chosenPersonData)
    const user = userData.get({ plain: true });
    const chosenUser = chosenPersonData ? chosenPersonData.get({ plain: true }): null;
console.log(user)
    res.render('profile', {
      ...user,
      chosenUser,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get('/profile/:name',async (req,res) => {
  //get other users profile page
  try {
    const userData = await User.findOne({where:{name:req.params.name}, include:[{model:Item}]})
    const user = userData.get({ plain: true });
    res.render('usersProfilePage',{
      ...user
    })
    // res.json(userData)
  } catch (error) {
    
  }
})


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
