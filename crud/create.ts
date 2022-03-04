// curl -X PUT -H 'Content-Type: application/octet-stream' --upload-file {filaname} '{url}'

export async function create(reqEvt: Deno.RequestEvent): Promise<Response> {
  const value = await reqEvt.request.arrayBuffer();
  const file = new Blob([value]);
  console.log("START");
  return await file.text().then(function(value) {
    console.log(value);
    return new Response(value, {
      status: 404,
    });
  });
}
