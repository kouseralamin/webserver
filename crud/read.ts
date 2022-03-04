import { readableStreamFromReader } from "../external/readableStreamFromReader.ts";

export async function read(reqEvt: Deno.RequestEvent): Promise<Response> {
  try {
    // TODO: SET PATH FROM COMMAND LINE ARGUMENTS
    const path: string = decodeURIComponent(
      Deno.cwd() + new URL(reqEvt.request.url).pathname,
    ).replace(/^\\\\\?\\/, "").replace(/\\/g, "\/").replace(/\/\/+/g, "\/");
    console.log(path);
    const value = await isDirectory(path);
    if (value === true) {
      const dirEntries: Deno.DirEntry[] = [];
      for await (const dirEntry of Deno.readDir(path)) {
        dirEntries.push(dirEntry);
      }
      return new Response(JSON.stringify(dirEntries), {
        status: 200,
      });
    } else {
      return isFile(path).then(async function (value) {
        if (value === true) {
          const file = await Deno.open(path, { read: true });
          const readableStream = readableStreamFromReader(file);
          const _headers = new Headers;
          _headers.append("content-type", "application/octet-stream");
          return new Response(readableStream, {
            headers: _headers
          });
        } else {
          return new Response(JSON.stringify(["PATH NOT FOUND"]), {
            status: 404
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

async function isFile(filePath: string): Promise<boolean> {
  try {
    if ((await Deno.lstat(filePath)).isFile === true) {
      return true;
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}

async function isDirectory(filePath: string): Promise<boolean> {
  try {
    if ((await Deno.lstat(filePath)).isDirectory === true) {
      return true;
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}
