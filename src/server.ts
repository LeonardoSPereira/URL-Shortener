import fastify from "fastify";
import { z } from "zod";
import { sql } from "./lib/postgres";
import postgres from "postgres";
import { redis } from "./lib/redis";

const app = fastify();

app.get("/:code", async (request, reply) => {
  const getLinkSchema = z.object({
    code: z.string().min(3),
  });

  const { code } = getLinkSchema.parse(request.params);

  const result = await sql`
    SELECT id, original_url
    FROM short_links
    WHERE short_links.code = ${code}
  `

  if (result.length === 0) {
    return reply.status(404).send({ message: "Not found" });
  }

  const link = result[0];

  await redis.zIncrBy("metrics:link_clicks", 1, link.id.toString());

  return reply.status(301).redirect(link.original_url);
})

app.get("/api/links", async () => {
  const result = await sql`
    SELECT *
    FROM short_links
    ORDER BY created_at DESC
  `

  return result;
})

app.post("/api/links", async (request, reply) => {
  // Validate the request body
  const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url()
  });

  const { code, url } = createLinkSchema.parse(request.body);

  // Insert the new link into the database and return the id
  try {
    const result = await sql`
    INSERT INTO short_links (code, original_url)
    VALUES (${code}, ${url})
    RETURNING id
    `

    const link = result[0];

    reply.status(201).send({ shortLinkId: link.id });
  } catch (err) {
    // If the code is already in use, return a 400 Bad Request
    if(err instanceof postgres.PostgresError) {
      if (err.code === "23505") {
        reply.status(400).send({ message: "Code already in use" });
      }
    }

    console.error(err);
    
    reply.status(500).send({ message: "Internal server error" });
  }
})

app.get("/api/metrics", async () => {
  const result = await redis.zRangeByScoreWithScores("metrics:link_clicks", 0, 50);

  const metrics = result
    .sort((a, b) => b.score - a.score)
    .map(item => {
      return {
        shortLinkId: Number(item.value),
        clicks: Number(item.score)
      }
    })

  return metrics
});

app.listen({
    port: 3333,
}).then(() => {
  console.log("🚀HTTP Server running on port 3333");
})