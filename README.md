## Requirements

- nodejs (20.9.0 or later) https://nodejs.org/en
- bun (1.1.13 or later) https://bun.sh/ (recommended)
- pnpm (8.10.5) or Node package manager https://pnpm.io/

## Getting Started

### Setting Environment Variables

Open your terminal, navigate to the root directory of the project and execute the following command:

``` bash
cp .env.example .env
```

This command copies the provided example file for local environment variables. Now, proceed to fill in the values for
the following environmental variables in the newly created .env file.

### Installation

First, install dependencies:

```bash
bun install
# or
pnpm install
# or
npm install
```

Run the development server:

```bash
bun dev
# or
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Features

- Build with [Next.js 14](https://nextjs.org/)(App Router)
- Fast and lightweight [Hono API](https://hono.dev/) web framework
- [Drizzle ORM](https://orm.drizzle.team/) to interact with [Neon Postgresql](https://neon.tech/) serverless database
- Build with [Shadcn UI](https://ui.shadcn.com/, HeadlessUI, React
  Icons, [TypeScript](https://www.typescriptlang.org/) & [Tailwind CSS](https://tailwindcss.com/)
- Authentication and Authorization with [Clerk](https://clerk.dev/)
- Beautifully crafted dashboard widgets
- Charts are built on top of [Recharts](https://recharts.org/en-US) package with limitless customization
- A mobile friendly controlled [TanStack Table](https://tanstack.com/table/latest) component for display any kind of
  large amount of data with pagination, filtering and sorting options

## Key Features

## Technologies Used

[![Technologies Used](https://skillicons.dev/icons?i=bun,nextjs,ts,tailwind,postgres,vercel)](https://skillicons.dev)
