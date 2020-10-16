import { RouterContext } from "https://deno.land/x/oak@v6.3.0/mod.ts";

import { Person } from "./types.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.8.0/mod.ts";
import { writeCSV } from "https://deno.land/x/csv/mod.ts";

let people: Person[] = [];

export const home = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(
    `${Deno.cwd()}/views/index.ejs`, { people: people, message: "" },
  );
}

export const postPeople = async (ctx: RouterContext) => {
  const body = await ctx.request.body({ type: 'form'});
  const value = await body.value;

  const person: Person = {
    fullName: value.get('fullname'),
    age: value.get('age'),
    questionA: value.get('questiona'),
    questionB: value.get('questionb'),
    questionC: value.get('questionc')
  }

  people.push(person);

  ctx.response.body = await renderFileToString(
    `${Deno.cwd()}/views/index.ejs`, { people: people, message: "" },
  );
}

export const downloadCsv = async(ctx: RouterContext) => {
  const FILE_NAME = "developers.csv";

  const file = await Deno.open(`./public/${FILE_NAME}`, { write: true, create: true, truncate: true });
  const headers = ["Fullname", "Age", "Frontend or Back", "Expected Wage", "Currently Working"];
  const rows = people.map(({ fullName, age, questionA, questionB, questionC }) => ([
    fullName, age, questionA, questionB, questionC
  ]));
  const csvRows = [headers, ...rows];

  await writeCSV(file, csvRows);
  file.close();

  ctx.response.body = await Deno.readFile(`${Deno.cwd()}/public/${FILE_NAME}`);
  ctx.response.headers.set('Content-disposition', `attachment; filename=developers.csv`);
  ctx.response.headers.set("Content-type","text/csv");
}
