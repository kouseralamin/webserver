export async function isFile(filePath: string): Promise<boolean> {
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
