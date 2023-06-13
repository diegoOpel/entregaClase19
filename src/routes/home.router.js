import express from "express"
import { usersModel } from "../dao/models/users.model.js"
const homeRouter = express.Router()

const privateRoute = (req, res, next) => {
  if (req.session.user) {
      next();
  } else {
      res.redirect('/login');
  }
};

const publicRoute = (req, res, next) => {
  if (!req.session.user) {
      next();
  } else {
      res.redirect('/profile');
  }
};

homeRouter.post('/register', publicRoute, async (req,res)=>{
  const { first_name, last_name, email, age, password } = req.body;
  let role = "user"
  if(email.toLowerCase()==="admincoder@coder.com"&&password==="adminCod3r123"){
    role= "admin"
  }
  const userEx = await usersModel.findOne({email});
  if(userEx) {
      console.error('Error, el usuario ya estaba registrado');
      res.redirect('/');
  }
  try {
      const user = new usersModel({ first_name, last_name, email, age, password, role });
      await user.save();
      res.redirect('/login');
  } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.redirect('/');
  }
})

homeRouter.get('/login', publicRoute, (req, res) => {
  res.render('login');
});

homeRouter.post('/login', publicRoute, async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await usersModel.findOne({ email, password });
      if (!user) {
          res.redirect('/login');
      } else {
          req.session.user = user;
          res.redirect('/products');
      }
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.redirect('/login');
  }
});


homeRouter.get('/profile', privateRoute, (req, res) => {
  if (!req.session.user) {
      res.redirect('/login');
  } else {
      const { first_name, last_name, email, age } = req.session.user;
      res.render('profile', { first_name, last_name, email, age });
  }
});

homeRouter.get('/logout', privateRoute, (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

homeRouter.get('/', (req,res)=>{
  res.render('home')
})
export default homeRouter