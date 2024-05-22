import * as jwt from "jsonwebtoken";
import { prisma } from "../../prisma";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token || !(await jwt.verify(token, "secret")))
      return new Response("Unauthorized", { status: 401 });
    const decoded = (await jwt.decode(token)) as jwt.JwtPayload;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) return new Response("Post not found", { status: 400 });
    //@ts-ignore
    if (!post.likedUsers.find((user) => user.id === decoded.id))
      return new Response("Post not liked", { status: 400 });
    const newPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: post.likes + 1,
        likedUsers: {
          disconnect: {
            id: decoded.id,
          },
        },
      },
    });
    return Response.json(newPost);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
