import { route } from "./route.ts";

async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  try {
    for await (const requestEvent of httpConn) {
      await requestEvent.respondWith(
        route(requestEvent)
      );
    }
  } catch(error) {
    console.error(error);
  }
}

const server = Deno.listen({
  port: 8080
});

for await (const conn of server) {
  console.log("NEW REQUEST");
  handle(conn);
}
