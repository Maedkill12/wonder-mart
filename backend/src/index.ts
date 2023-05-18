import express from "express";
import productRoute from "./routes/productRoute";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/products", productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
