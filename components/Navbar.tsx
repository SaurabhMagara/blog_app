"use client"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {

    const image = "https://static.vecteezy.com/system/resources/previews/047/656/219/non_2x/abstract-logo-design-for-any-corporate-brand-business-company-vector.jpg"
    return (
        <nav className="flex justify-between items-center w-11/12 rounded-2xl border  border-t-0 py-3 px-2 sticky top-0 bg-black">
            <div className="flex justify-center items-center gap-2">

                {image ? <div className="rounded-full overflow-hidden cursor-pointer">
                    <Image alt="logo" src={image} width={40} height={40} />
                </div> 
                :
                <div className="rounded-full overflow-hidden cursor-pointer bg-gradient-to-tr from-sky-700 to-lime-900 h-10 w-10 flex justify-center items-center">
                    <span className="text-xl">B</span>
                </div>
                }
                <div className="cursor-pointer">
                    <span className="text-2xl">Bloggs</span>
                </div>
            </div>
            <NavigationMenu className="flex justify-between">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref >
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Blogs
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                               Sign in 
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    )
}

export default Navbar;