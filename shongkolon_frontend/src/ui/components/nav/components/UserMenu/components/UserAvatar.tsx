import Image from 'next/image';
import { User } from '@/types';

type Props = {
  user: User;
};

export const UserAvatar = ({ user }: Props) => {
  const label = user.name ? `${user.name.slice(0, 2)}` : user.email.slice(0, 2);

  if (user.profilePhoto.path) {
    return (
      <Image
        className="h-8 w-8 rounded-full border"
        aria-hidden="true"
        src={user.profilePhoto.path}
        width={24}
        height={24}
        alt=""
      />
    );
  }

  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-center text-xs font-bold uppercase"
      aria-hidden="true"
    >
      {label}
    </span>
  );
};
