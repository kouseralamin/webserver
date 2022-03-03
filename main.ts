async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);

  for await (const requestEvent of httpConn) {
    new Promise((r) => setTimeout(r, 10000)).then((_) => {
      console.log("DONE");
    });

    await requestEvent.respondWith(
      new Response("hello world", {
        status: 200,
      }),
    );
  }
}

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  console.log("NEW REQUEST");
  handle(conn);
}
