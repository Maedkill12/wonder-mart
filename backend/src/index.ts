import "express-async-errors";
import express from "express";
import cookie from "cookie-parser";
import productRoute from "./routes/productRoute";
import userRoute from "./routes/userRoute";
import orderRoute from "./routes/orderRoute";
import shippingRoute from "./routes/shippingRoute";
import paymentRoute from "./routes/paymentRoute";
import cartRoute from "./routes/cartRoute";
import authRoute from "./routes/authRoute";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookie());
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/orders", orderRoute);
app.use("/shipping", shippingRoute);
app.use("/payment", paymentRoute);
app.use("/cart", cartRoute);
app.use("/auth", authRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
