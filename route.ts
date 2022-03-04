import { read } from "./crud/read.ts";

export async function route(reqEvt: Deno.RequestEvent): Promise<Response> {
  if (reqEvt.request.method.toUpperCase() === "GET") {
    return await read(reqEvt).then(function(value) {
        return value;
    });
  } else {
    return new Response("NOT FOUND", {
      status: 400,
    });
  }
}
