// curl -X POST -H 'Content-Type: application/octet-stream' --upload-file {filaname} '{url}'

import { Buffer } from "../utilities/buffer.ts";
import { isDirectory } from "../utilities/is_directory.ts";

export async function create(reqEvt: Deno.RequestEvent): Promise<Response> {
  try {
    const path: string = decodeURIComponent(
      Deno.cwd() + new URL(reqEvt.request.url).pathname,
    ).replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");
    const _is_directory = await isDirectory(path.substring(0, path.lastIndexOf("/")));
    if (_is_directory === true) {
      const _arrayBuffer = await reqEvt.request.arrayBuffer();
      const file = new Blob([_arrayBuffer]);
      const buffer = await file.arrayBuffer();
      const unit8arr = new Buffer(buffer).bytes();
      return Deno.writeFile(path, unit8arr).then(function (_) {
        return new Response("", {
          status: 201,
        });
      });
    } else {
      return new Response("", {
        status: 404,
      });
    }
  } catch (_) {
    return new Response("", {
      status: 500,
    });
  }
}
