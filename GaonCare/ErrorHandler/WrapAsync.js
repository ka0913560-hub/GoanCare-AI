
// WrapAsync fucntion Express.js me async functions ke errors ko handle karta hai 

// wrapAsync (ya WrapAsync) ka main kaam Express.js me async functions ke errors ko handle karna hota hai, taaki hume har async route me alag se try...catch likhne ki zarurat na pade.


// 1.  Ye ek higher-order function hai (jo dusre function ko input leta hai).
// 2. Ye async function (fn) ko call karta hai.
// 3. Agar us async function me koi error throw hota hai, to .catch() us error
//  ko next(err) me pass kar deta hai.
//4. next(err) se Express ka error-handling middleware automatically activate ho jata hai.
module.exports = WrapAsync =(fn) =>{
  return function (req, res, next) {
    fn(req, res, next).catch((err)=> next(err))
  };
}

