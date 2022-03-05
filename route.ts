import { create } from "./crud/create.ts";
import { read } from "./crud/read.ts";

export async function route(reqEvt: Deno.RequestEvent): Promise<Response> {
  if (reqEvt.request.method.toUpperCase() === "GET") {
    return await read(reqEvt).then(function (value) {
      value.headers.append("Access-Control-Allow-Origin", "*");
      return value;
    });
  } else if (reqEvt.request.method.toUpperCase() === "POST") {
    return await create(reqEvt).then(function (value) {
      value.headers.append("Access-Control-Allow-Origin", "*");
      return value;
    });
  } else {
    return new Response("NOT FOUND", {
      status: 400,
    });
  }
}
