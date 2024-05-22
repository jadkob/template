import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-[10vw]">
      <Button asChild>
        <Link href={"/signup"}>SignUp</Link>
      </Button>
      <Button asChild>
        <Link href={"/login"}>LogIn</Link>
      </Button>
    </div>
  );
}
