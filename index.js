const express = require("express");
const app = express();
const port = process.env.PORT || 4000; 
const cors = require("cors")
const connectDB = require("./Config/dbConfig");
const cookieParser = require("cookie-parser");  

 
require('dotenv').config(); 

// database connection 
connectDB() 

// middelwares
app.use(express.json());
app.use(cookieParser());  

// cors middleware
app.use(
  cors({
    origin: [
      "https://justlinklogistics.com.ng",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://justink.vercel.app"
    ], 
    credentials: true, 
  })
);



// edit route for escort
app.use("/auth", require("./Routes/Ecommerce/AuthRoute"));  
app.use("/become-a-vendor", require("./Routes/Ecommerce/becomeAVendorRoute"));  
app.use("/", require("./Routes/Ecommerce/productsRoute"));  
app.use("/", require("./Routes/Ecommerce/verifyPaymentRoute"));
app.use("/", require("./Routes/Ecommerce/ordersRoute"));

app.use("/logistics", require("./Routes/Logistics/shipmentRoute"));

// run server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})