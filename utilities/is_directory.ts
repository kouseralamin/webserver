export async function isDirectory(filePath: string): Promise<boolean> {
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
