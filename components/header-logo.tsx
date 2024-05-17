import React from "react";
import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image src="/logo.svg" alt="logo" height={28} width={28} />
        <p className="font-semibold text-white text-2xl ml-2.5">FinanceForge</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
