// curl -X POST -H 'Content-Type: application/octet-stream' --upload-file {filaname} '{url}'

import { Buffer } from "../utilities/buffer.ts";
import { isDirectory } from "../utilities/is_directory.ts";

export async function create(reqEvt: Deno.RequestEvent): Promise<Response> {
  try {
    const path: string = decodeURIComponent(
      Deno.cwd() + new URL(reqEvt.request.url).pathname,
    ).replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");
    if (path[path.length - 1] === "/") {
      const _is_directory = await isDirectory(
        path.substring(0, path.lastIndexOf("/")).substring(
          0,
          path.substring(0, path.lastIndexOf("/")).lastIndexOf("/"),
        ),
      );
      const _is_new_directory = await isDirectory(path);
      if (_is_directory === true && _is_new_directory === false) {
        return Deno.mkdir(path).then(function (_) {
          console.info("NEW DIRECTORY: " + path);
          return new Response("[CREATED DIRECTORY]", {
            status: 201,
          });
        });
      } else {
        console.info("ERROR: Can not create a new directory in: " + path);
        return new Response("[ERROR CREATING DIRECTORY]", {
          status: 500,
        });
      }
    } else {
      const _is_directory = await isDirectory(
        path.substring(0, path.lastIndexOf("/")),
      );
      if (_is_directory === true) {
        const _arrayBuffer = await reqEvt.request.arrayBuffer();
        const file = new Blob([_arrayBuffer]);
        const buffer = await file.arrayBuffer();
        const unit8arr = new Buffer(buffer).bytes();
        return Deno.writeFile(path, unit8arr).then(function (_) {
          console.info("NEW FILE: " + path);
          return new Response("", {
            status: 201,
          });
        });
      } else {
        console.info("ERROR: Can not create a new file in: " + path);
        return new Response("", {
          status: 404,
        });
      }
    }
  } catch (_) {
    console.info("UNKNOWN ERROR: Creating new directory or file.");
    return new Response("", {
      status: 500,
    });
  }
}
