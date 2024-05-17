'use client';
import React, { useState } from 'react';
import { navbarLinks } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import NavButton from '@/components/nav-button';
import { useMedia } from 'react-use';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMedia('(max-width: 1024px)', false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="border-none bg-white/10 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus-visible:ring-transparent focus-visible:ring-offset-0"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {navbarLinks.map((item) => (
              <Button
                key={item.route}
                variant={item.route === pathname ? 'secondary' : 'ghost'}
                onClick={() => onClick(item.route)}
                className="w-full justify-start"
              >
                {/* TODO: Add icons (like ones on Isomorphic) */}
                {item.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <nav className="hidden items-center gap-x-2 overflow-auto lg:flex">
      {navbarLinks.map((item) => (
        <NavButton
          key={item.route}
          href={item.route}
          label={item.label}
          isActive={pathname === item.route}
        />
      ))}
    </nav>
  );
};

export default Navigation;
