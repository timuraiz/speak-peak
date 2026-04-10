import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-[300px] text-center">
        {/* 404 illustration */}
        <div className="relative w-[300px] h-[189px]">
          <Image
            src="/404-shadow.png"
            alt=""
            fill
            className="object-contain translate-y-3"
            priority
          />
          <Image
            src="/404.png"
            alt="404"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-semibold text-dark">
            Oops, the page you&apos;re looking for does not exist
          </p>
          <p className="text-sm text-dark-70">
            Please double-check the URL or try refreshing the page
          </p>
        </div>

        {/* Button */}
        <Link
          href="/"
          className="w-full bg-accent text-white font-semibold text-sm h-[49px] rounded-2xl flex items-center justify-center shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
