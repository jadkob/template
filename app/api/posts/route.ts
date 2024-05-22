import * as jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { isEmpty } from "../isEmpty";

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
        NOT: {
          author: {
            username,
          },
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
export async function POST(req: Request) {
  interface Body {
    title?: string;
    text?: string;
  }
  try {
    const { title, text } = (await req.json()) as Body;
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token || !(await jwt.verify(token, "secret")))
      return new Response("Unauthorized", { status: 401 });
    if (!text || isEmpty([text]))
      return new Response("No text", { status: 400 });
    const post = await prisma.post.create({
      data: {
        text: text,
        title: title ? title : "",
        author: {
          connect: {
            username: "XXXXX",
          },
        },
        likes: 0,
      },
    });
    return Response.json(post);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
