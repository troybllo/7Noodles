import { z } from "zod";

/**
 * Environment variables are validated once, at module load, so a misconfigured
 * deployment fails at boot with a readable message instead of at the first
 * request that happens to need the value.
 *
 * Client variables must be referenced by their full literal name below —
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time and cannot resolve
 * a computed key.
 */

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({
    error: "Must be an absolute URL, e.g. https://7noodles.com",
  }),
});

function parse<T extends z.ZodType>(
  schema: T,
  source: unknown,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(source);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid ${label} environment variables:\n${issues}`);
  }

  return result.data;
}

export const serverEnv = parse(serverSchema, process.env, "server");

export const clientEnv = parse(
  clientSchema,
  { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL },
  "client",
);
