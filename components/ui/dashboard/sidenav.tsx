import Link from "next/link";
import NavLinks from "@/components/ui/dashboard/nav-links";
import AcmeLogo from "@/components/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CardWithBackground } from "./cards";
import LogoutButton from "./logout";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:py-6 bg:020817">
      <CardWithBackground img="/sidenav.jpeg" alt="a" />
      
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block dark:bg-[#020817]"></div>

        <form>
          <LogoutButton />
        </form>
      </div>
    </div>
  );
}
