import app from "./app.js";

import connectDB from "./db/Connect.js";
console.log("hello")

connectDB()
.then(() => {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running at port : ${process.env.PORT}`)
  }
)
})
.catch((err)=>{
  console.log("MONGODB Connection failed !!", err);
})


