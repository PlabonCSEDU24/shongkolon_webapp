import { SquarePlus } from 'lucide-react';
import Link from 'next/link';

export const CartNavItem = () => {
  return (
    <Link href="/post" className="relative flex items-center">
      <SquarePlus className="h-6 w-6 shrink-0" aria-hidden="true" />
    </Link>
  );
};
