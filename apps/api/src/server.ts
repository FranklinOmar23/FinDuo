import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  // TODO: implementar un sistema de logging estructurado.
  console.log(`FinDúo API escuchando en el puerto ${env.PORT}`);
});
