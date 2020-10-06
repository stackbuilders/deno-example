import { RouterContext } from "https://deno.land/x/oak@v6.3.0/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.8.0/mod.ts";
import { writeCSV } from "https://deno.land/x/csv/mod.ts";

// type Person<T extends unknown[]> = [string, number, ...T];

let people: any = [];

function tuple<T extends any[]>(...args: T): T {
  return args;
}

// function concat<T, U>(arr1: T[], arr2: U[]): Array<T | U> {
//   return [...arr1, ...arr2];
// }

export const home = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(
    `${Deno.cwd()}/views/index.ejs`, { people: people, message: "" },
  );
}

export const postPeople = async (ctx: RouterContext) => {
  const body = await ctx.request.body({ type: 'form'});
  const value = await body.value;

  const fullname = value.get('fullname');
  const age = value.get('age');
  const questionA = value.get('questiona');
  const questionB = value.get('questionb');
  const questionC = value.get('questionc');

  // Add person tuple to array
  const person = tuple(fullname, age, questionA, questionB, questionC);
  
  people.push(person);

  ctx.response.body = await renderFileToString(
    `${Deno.cwd()}/views/index.ejs`, { people: people, message: "" },
  );
}

export const downloadPeople = async(ctx: RouterContext) => {
  const f = await Deno.open("./developers.csv", { write: true, create: true, truncate: true });
  const rows = [
    ["Fullname", "Age", "Frontend or Back", "Expected Wage", "Currently Working"],
    ...people
  ];

  console.log('ROWS in file::',rows);

  await writeCSV(f, rows);
  f.close();

  // ctx.response.headers.set("Content-Disposition", "attachment;filename=developers.csv");
  // ctx.response.headers.set("Content-type","text/csv");

  ctx.response.body = await renderFileToString(
    `${Deno.cwd()}/views/index.ejs`, { people: people, message: "The developers.csv file was generated in the app folder." },
  );
}
