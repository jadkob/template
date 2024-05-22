import * as jwt from "jsonwebtoken";
import { prisma } from "../../prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token || !jwt.verify(token, "secret"))
      return new Response("Unauthorized", { status: 401 });
    const decoded: any = await jwt.decode(token);
    const username = decoded.username as string;
    const post = await prisma.post.findMany({
      where: {
        author: {
          username,
        },
      },
      include: { author: true },
    });
    if (post.length === 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(post);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
