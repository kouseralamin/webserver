export function readableStreamFromReader(
    reader: Deno.Reader | (Deno.Reader & Deno.Closer),
    options: ReadableStreamFromReaderOptions = {},
  ): ReadableStream<Uint8Array> {
    const {
      autoClose = true,
      chunkSize = 16_640,
      strategy,
    } = options;
  
    return new ReadableStream({
      async pull(controller) {
        const chunk = new Uint8Array(chunkSize);
        try {
          const read = await reader.read(chunk);
          if (read === null) {
            if (isCloser(reader) && autoClose) {
              reader.close();
            }
            controller.close();
            return;
          }
          controller.enqueue(chunk.subarray(0, read));
        } catch (e) {
          controller.error(e);
          if (isCloser(reader)) {
            reader.close();
          }
        }
      },
      cancel() {
        if (isCloser(reader) && autoClose) {
          reader.close();
        }
      },
    }, strategy);
  }

  interface ReadableStreamFromReaderOptions {
    /** If the `reader` is also a `Deno.Closer`, automatically close the `reader`
     * when `EOF` is encountered, or a read error occurs.
     *
     * Defaults to `true`. */
    autoClose?: boolean;
  
    /** The size of chunks to allocate to read, the default is ~16KiB, which is
     * the maximum size that Deno operations can currently support. */
    chunkSize?: number;
  
    /** The queuing strategy to create the `ReadableStream` with. */
    strategy?: { highWaterMark?: number | undefined; size?: undefined };
  }

  function isCloser(value: unknown): value is Deno.Closer {
    return typeof value === "object" && value != null && "close" in value &&
      // deno-lint-ignore no-explicit-any
      typeof (value as Record<string, any>)["close"] === "function";
  }