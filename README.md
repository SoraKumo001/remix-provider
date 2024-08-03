# remix-provider

Provides the ability to distribute environment variables etc. to clients when using Remix + Cloudflare

- ServerProvider

  - Set the values you want to send from the server side to the client.

- RootProvider
  - Distribute the values set by the ServerProvider to the client.
- RootValue
  - Output the values set in ServerProvider at rendering time.
- useRootContext
  - Hook to receive the values set by the ServerProvider in the component.

## Sample

### entry.server.tsx

```tsx
import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerProvider } from "remix-provider";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext
) {
  const body = await renderToReadableStream(
    // Set the values you want to distribute to clients.
    <ServerProvider
      value={{
        env: loadContext.cloudflare.env,
      }}
    >
      <RemixServer context={remixContext} url={request.url} />
    </ServerProvider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

### root.tsx

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { RootProvider, RootValue } from "remix-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Additional providers.
    <RootProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          {/* Install components to transfer data to clients. */}
          <RootValue />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </RootProvider>
  );
}

export default function App() {
  return <Outlet />;
}
```

### routes/\_index.tsx

```tsx
import { useRootContext } from "remix-provider";

export default function Index() {
  // Get the value distributed to clients.
  const value = useRootContext();
  return <div className="whitespace-pre">{JSON.stringify(value, null, 2)}</div>;
}
```

### Execution Result

- .dev.vars

```env
Test01=abc
Test02=xyz
```

- Output

```json
{
  "env": {
    "Test01": "abc",
    "Test02": "xyz"
  }
}
```
