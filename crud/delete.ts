import { isDirectory } from "../utilities/is_directory.ts";
import { isFile } from "../utilities/is_file.ts";

export async function del(reqEvt: Deno.RequestEvent): Promise<Response> {
  try {
    // TODO: SET PATH FROM COMMAND LINE ARGUMENTS
    const path: string = decodeURIComponent(
      Deno.cwd() + new URL(reqEvt.request.url).pathname,
    ).replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");
    console.log(path);
    const _is_directory = await isDirectory(path);
    if (_is_directory === true) {
      return Deno.remove(path, { recursive: true }).then(function (_) {
        return new Response(JSON.stringify([]), {
          status: 200,
        });
      });
    } else {
      return isFile(path).then(function (value: boolean) {
        if (value === true) {
            return Deno.remove(path).then(function (_) {
                return new Response(JSON.stringify([]), {
                  status: 200,
                });
              });
        } else {
          return new Response(JSON.stringify(["PATH NOT FOUND"]), {
            status: 404,
          });
        }
      });
    }
  } catch (_) {
    return new Response(JSON.stringify(["PATH NOT FOUND"]), {
      status: 404,
    });
  }
}
