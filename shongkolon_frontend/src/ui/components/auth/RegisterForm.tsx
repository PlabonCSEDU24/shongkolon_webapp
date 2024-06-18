export function RegisterForm({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="flex flex-col space-y-3 my-4">
      <div>
        <label htmlFor="name" className="block text-xs text-gray-600 uppercase">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter name"
          required
          className="mt-1 text-sm block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xs text-gray-600 uppercase"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          required
          className="mt-1 text-sm block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-xs text-gray-600 uppercase">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          placeholder="+88"
          required
          className="mt-1 text-sm block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs text-gray-600 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 text-sm block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black"
        />
      </div>
      {children}
    </form>
  );
}
