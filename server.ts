import { Application, Router } from "https://deno.land/x/oak@v6.3.0/mod.ts";
import { downloadCsv, home, postPeople } from "./routes.ts";

const app = new Application();
const router = new Router();

router
  .get("/", home)
  .post("/people", postPeople)
  .post("/download", downloadCsv)

app.addEventListener('error', evt => {
  console.log(evt.error);
});
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 3000 });
console.log("Started listening on port: 3000");