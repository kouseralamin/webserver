// curl -X PUT -H 'Content-Type: application/octet-stream' --upload-file {filaname} '{url}'

export async function create(reqEvt: Deno.RequestEvent): Promise<Response> {
  console.log(reqEvt.request.headers);
  const value = await reqEvt.request.arrayBuffer();
  let data = new Blob([value]);
  console.log("START");
  await data.text().then(function(value) {
    console.log(value);
  });
  console.log("END");
  console.log(value);
  return new Response(JSON.stringify(reqEvt.request.headers), {
    status: 404,
  });
}
