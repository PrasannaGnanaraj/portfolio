import { useRouter } from "next/router"
export default function Layout({ children }) {
    const { pathname } = useRouter()
    const isRoot = pathname === "/"

    const header = !isRoot && (
        <nav
            style={{ backgroundColor: "#002b36", color: "#fdf6e3" }}
            className="flex text-white justify-start sticky top-0"
        >
            <div className="m-1">
                <img
                    className="object-contain h-12"
                    src="/android-chrome-512x512.png"
                />
            </div>
            <div className="flex-grow self-center text-xl">
                <span><a href="/#home">Home</a></span>
                <span className="ml-2"><a href="/#blog">Blog</a></span>
                <span className="ml-2"><a href="/#contact">Contact</a></span>
            </div>
        </nav>
    );

    return (
        <div style={{ backgroundColor: "#073642", color: "#eee8d5" }}>
            <div className="max-w-screen-sm px-4 py-8 mx-auto">
                <header>{header}</header>
                <main>{children}</main>
                <footer className="my-8">
                    © {new Date().getFullYear()}, Built with{" "}
                    <a href="https://nextjs.org/">Next.js</a> &#128293;
      </footer>
            </div>
        </div>

    );
}