import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { isEmpty } from "../isEmpty";
import { prisma } from "../prisma";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || isEmpty([username, password]))
      return new Response("Please fill all fields");
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (user) return new Response("Username taken", { status: 400 });

    const newUser = await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10),
      },
    });

    const token = jwt.sign({ id: newUser.id, username }, "secret");
    return Response.json(token);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
