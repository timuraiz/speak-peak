import { ReactNode } from "react";


export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#FAFAFA] rounded-3xl">
      {children}
    </div>
  );
}

