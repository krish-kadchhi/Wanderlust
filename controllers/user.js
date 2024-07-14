const User = require("../models/user");

module.exports.renderSignupPage = (req,res)=>
{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>
{
  try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registerUser = await User.register(newUser, password);
    req.login(registerUser,(err)=>
    {
      if(err)
      {
        next(err);
      }
    req.flash("success","welcom to wanderlust");
    res.redirect("/listings");
    })
  }
  catch(e)
  {
    console.log(e);
    req.flash("error",e.message);
    res.redirect("/listings");
  }
}

module.exports.renderLoginForm = (req,res)=>
{
  res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>
{
   req.flash("success","Welcome to wanderlust");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);

}

module.exports.logout = (req,res,next)=>
{ 
  req.logout((err)=>
  {
    if(err)
    {
      next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
}