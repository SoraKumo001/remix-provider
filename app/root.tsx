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
