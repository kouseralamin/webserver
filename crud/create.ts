// curl -X POST -H 'Content-Type: application/octet-stream' --upload-file {filaname} '{url}'

import { Buffer } from "../utilities/buffer.ts";

export async function create(reqEvt: Deno.RequestEvent): Promise<Response> {
  const path: string = decodeURIComponent(
    Deno.cwd() + new URL(reqEvt.request.url).pathname,
  ).replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");
  const value = await reqEvt.request.arrayBuffer();
  const file = new Blob([value]);
  const buffer = await file.arrayBuffer();
  const unit8arr = new Buffer(buffer).bytes();
  return Deno.writeFile(path, unit8arr).then(function(_) {
    return new Response("", {
      status: 201,
    });
  });
}
