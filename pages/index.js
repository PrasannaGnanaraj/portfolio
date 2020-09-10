import Head from 'next/head'
import fs from 'fs'
import matter from 'gray-matter'
import Link from "next/link"

export default function Home({ posts }) {
  console.log(posts);
  return (
    <div style={{ backgroundColor: "#073642", color: "#eee8d5" }}>
      <Head>
        <title>Prasanna Gnanaraj</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav
        style={{ backgroundColor: "#002b36", color: "#fdf6e3" }}
        className="flex text-white justify-start sticky top-0"
      >
        <div className="m-1">
          <img
            className="object-contain h-12"
            src="android-chrome-512x512.png"
          />
        </div>
        <div className="flex-grow self-center text-xl">
          <span><a href="#home">Home</a></span>
          <span className="ml-2"><a href="#blog">Blog</a></span>
          <span className="ml-2"><a href="#contact">Contact</a></span>
        </div>
      </nav>
      <div className="flex justify-evenly h-screen" id="home">
        <div className="self-center">
          <img className="object-contain h-48 rounded-full" src="me.jpg" />
        </div>
        <div className="text-justify self-center">
          <p className="lg:text-3xl text-xl">
            Hi, Im Prasanna.<br /> Im a Software Developer <br />
            Here to push limits and develop quality software
        </p>
        </div>
      </div>
      <div className="flex h-screen" id="blog">
        <div className="mt-16 w-full">
          {posts.map(({ frontmatter: { title, description, date }, slug }) => (
            <article key={slug} className="w-full p-4 border-solid border-2 rounded-lg border-green-800">
              <header className="flex justify-between">
                <h3 className="italic">
                  <Link href={"/post/[slug]"} as={`/post/${slug}`}>
                    <a className="text-3xl font-semibold text-orange-600 no-underline">
                      {title}
                    </a>
                  </Link>
                </h3>
                <span>{date}</span>
              </header>
              <section>
                <p className="text-xs">
                  {description}
                </p>
              </section>
            </article>
          ))}
        </div>
      </div>
      <div className="flex h-screen" id="contact">
        <div className="text-3xl self-center text-center w-full">
          <ul>
            <li className="inline-block m-2"><a href="https://github.com/PrasannaGnanaraj">Github</a></li>
            <li className="inline-block m-2"><a href="https://www.linkedin.com/in/gnana-prasanna/">LinkedIn</a></li>
          </ul>
          <img
            className="m-auto"
            src="https://www.codewars.com/users/PrasannaGnanaraj/badges/small"
          />
        </div>
      </div>
    </div >
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(`${process.cwd()}/content/posts`);
  const posts = files.map((filename) => {
    const markdownWithMetadata = fs.readFileSync(`content/posts/${filename}`).toString();

    const { data } = matter(markdownWithMetadata);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = data.date.toLocaleDateString("en-US", options);

    const frontmatter = {
      ...data,
      date: formattedDate
    };

    return {
      slug: filename.replace(".md", ""),
      frontmatter,
    }
  });

  return {
    props: {
      posts,
    }
  }
}
