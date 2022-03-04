export async function read(reqEvt: Deno.RequestEvent): Promise<Response> {
  try {
    // TODO: SET PATH FROM COMMAND LINE ARGUMENTS
    console.log(decodeURIComponent(Deno.cwd() + new URL(reqEvt.request.url).pathname).replace(/^\\\\\?\\/,"").replace(/\\/g,'\/').replace(/\/\/+/g,'\/'));
    const dirEntries: Deno.DirEntry[] = [];
    for await (
      const dirEntry of Deno.readDir(
        decodeURIComponent(Deno.cwd() + new URL(reqEvt.request.url).pathname).replace(/^\\\\\?\\/,"").replace(/\\/g,'\/').replace(/\/\/+/g,'\/'),
      )
    ) {
      dirEntries.push(dirEntry);
    }
    return new Response(JSON.stringify(dirEntries), {
      status: 200,
    });
  } catch (_) {
    return new Response(JSON.stringify([]), {
      status: 400,
    });
  }
}
