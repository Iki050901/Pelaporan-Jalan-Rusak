import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/bg.png"
        alt="Background"
        fill
        className="hidden md:block"
        style={{
          objectFit: "cover",
        }}
        priority
      />
      <Image
        src="/images/bg2.png"
        alt="Background mobile"
        fill
        className="block md:hidden"
        style={{
          objectFit: "cover",
        }}
        priority
      />
      <div className="relative z-10 max-w-md w-full p-4">
        <LoginForm />
      </div>
    </div>
  );
}
