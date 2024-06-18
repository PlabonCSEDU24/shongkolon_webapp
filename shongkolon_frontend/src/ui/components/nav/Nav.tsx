'use client';
import { UserMenuContainer } from './components/UserMenu/UserMenuContainer';
import { CartNavItem } from './components/CartNavItem';
import { NavLinks } from './components/NavLinks';
import { MobileMenu } from './components/MobileMenu';
import { SearchBar } from './components/SearchBar';
import { useAuth } from '@/context/AuthContext';

export const Nav = () => {
  const { isLoggedIn } = useAuth();
  return (
    <nav className="flex w-full gap-4 lg:gap-6" aria-label="Main navigation">
      <ul className="hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0">
        <NavLinks />
      </ul>
      <div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8">
        <div className="hidden lg:flex">
          <SearchBar />
        </div>
        <UserMenuContainer />
      </div>
      {isLoggedIn && (
        <div className="flex items-center">
          <CartNavItem />
        </div>
      )}

      <MobileMenu>
        <SearchBar />
        <NavLinks />
      </MobileMenu>
    </nav>
  );
};
