import "express-async-errors";
import express from "express";
import productRoute from "./routes/productRoute";
import userRoute from "./routes/userRoute";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
