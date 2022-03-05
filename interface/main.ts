import { readableStreamFromReader } from "../utilities/readableStreamFromReader.ts";

async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  try {
    for await (const requestEvent of httpConn) {
      if (new URL(requestEvent.request.url).pathname === "/") {
        await requestEvent.respondWith(
          index(),
        );
      }
      if (new URL(requestEvent.request.url).pathname === "/script.js") {
        await requestEvent.respondWith(
          script(),
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const server = Deno.listen({
  port: 8000,
});

for await (const conn of server) {
  console.log("NEW REQUEST");
  handle(conn);
}

async function index(): Promise<Response> {
  const file = await Deno.open("./index.html", { read: true });
  const readableStream = readableStreamFromReader(file);
  const _headers = new Headers();
  _headers.append("content-type", "text/html");
  return new Response(readableStream, {
    headers: _headers,
  });
}

async function script(): Promise<Response> {
  const file = await Deno.open("./script.js", { read: true });
  const readableStream = readableStreamFromReader(file);
  const _headers = new Headers();
  _headers.append("content-type", "text/html");
  return new Response(readableStream, {
    headers: _headers,
  });
}
