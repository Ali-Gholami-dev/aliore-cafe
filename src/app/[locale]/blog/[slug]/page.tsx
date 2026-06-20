import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

interface BlogPostParams {
  params: { locale: Locale; slug: string };
}

const POSTS: Record<string, {
  title: string; excerpt: string; content: string[];
  image: string; date: string; readTime: string;
  tag: string; author: string; authorRole: string;
  authorImage: string;
}> = {
  "the-art-of-perfect-espresso": {
    title:       "The Art of the Perfect Espresso",
    excerpt:     "From bean selection to extraction pressure — the science and soul behind Aliore's espresso.",
    image:       "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80",
    date:        "December 12, 2024",
    readTime:    "6 min",
    tag:         "Coffee",
    author:      "Marco Bianchi",
    authorRole:  "Head Barista & Coffee Director",
    authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    content: [
      "At Aliore, coffee is not a beverage. It is a ritual — one that begins months before a single cup is poured, in the altitude estates of Ethiopia, Colombia, and Yemen where our beans are grown.",
      "The espresso is the foundation of everything we do at the bar. We pull a double shot at 9 bars of pressure, using water heated to exactly 93°C, ground to a resistance that produces a 28-second extraction. But these numbers are not dogma — they are starting points.",
      "Every morning before we open, our team pulls twenty test shots. We adjust the grind by single increments, taste each result, and only when consensus is reached do we begin service. This process takes 45 minutes. We have never once skipped it.",
      "Our house blend is built around a washed Ethiopian Yirgacheffe as the base — bright, floral, with notes of bergamot and stone fruit. We balance this with a natural-processed Colombian that adds body and chocolate depth. The ratio shifts slightly each season as the green coffee ages.",
      "We serve our espresso in pre-heated ceramic cups made for us by a ceramicist in Lyon. The temperature of the cup matters more than most people realise — a cold cup drops the liquid temperature by 4°C in the first sip, collapsing the aromatics.",
      "The perfect espresso, in our view, is the one that makes you pause. Not just the first sip, but the aftertaste — a lingering sweetness that stays with you for minutes. When we achieve that, we know we have done our job.",
    ],
  },
  "truffle-season-2024": {
    title:       "Truffle Season: What's on the Menu",
    excerpt:     "Winter in the kitchen means black truffle. Chef Alexandre shares his philosophy.",
    image:       "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1400&q=80",
    date:        "November 28, 2024",
    readTime:    "4 min",
    tag:         "Seasonal",
    author:      "Alexandre Moreau",
    authorRole:  "Executive Chef & Founder",
    authorImage: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
    content: [
      "The black truffle — Tuber melanosporum — arrives at Aliore each December like a quiet but unmistakable guest. We source ours from a single family in Périgord who have been hunting them for three generations.",
      "This year's harvest is exceptional. The summer rains arrived precisely when the mycelium needed moisture, and the autumn was dry and cold — exactly the conditions that concentrate the truffle's volatile compounds into something almost impossibly aromatic.",
      "We integrate truffle into our winter menu with restraint. The temptation, especially in a luxury context, is to cover everything in black shavings and call it done. We resist this. Truffle should elevate, not dominate.",
      "Our truffle risotto uses a mushroom consommé as the cooking liquid — we reduce wild ceps, morels, and porcini for four hours to create a broth of extraordinary depth. The truffle is added at two stages: shaved into the base as it finishes cooking, and again tableside as a final flourish.",
      "The pairing we recommend? A 2018 Meursault from our cellar. The buttery richness and stone fruit of the burgundy complements the earthiness without competing. It is, I think, one of the great pairings of the season.",
    ],
  },
  "private-dining-guide": {
    title:       "Planning the Perfect Private Dinner",
    excerpt:     "From intimate proposals to corporate celebrations — making it unforgettable.",
    image:       "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80",
    date:        "November 10, 2024",
    readTime:    "5 min",
    tag:         "Events",
    author:      "Sophie Laurent",
    authorRole:  "Head Pastry Chef",
    authorImage: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=200&q=80",
    content: [
      "Our private dining room — La Salle Dorée — seats up to 30 guests and has hosted marriage proposals, BAFTA pre-ceremony dinners, board meetings, and 90th birthday celebrations. Each occasion leaves a mark on us, too.",
      "The most important thing to understand about planning a private dinner is this: the food is secondary to the experience. Of course the food must be exceptional — but what people remember is how they felt. The lighting, the pace, the way their host greeted them at the door.",
      "We recommend a pre-dinner consultation with our events team at least two weeks ahead. We will discuss the occasion, any dietary requirements, preferred wines, and whether there are any surprises you want to arrange — a customised dessert, a message hidden in a menu, a musician for the final hour.",
      "Our private menus are built around 4 to 7 courses. We do not have a fixed private menu — everything is created specifically for your event. Chef Alexandre meets with clients personally for dinners above 10 guests. He considers this non-negotiable.",
      "For those planning a proposal, we have a few traditions that our guests have found moving: a gold leaf message piped onto the pre-dessert plate, a bottle of Krug Grande Cuvée chilled and waiting, and a quiet word with the maître d' so the room is perfectly composed at the right moment.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const post = POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title:       post.title,
    description: post.excerpt,
    openGraph: {
      title:  post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { locale: Locale; slug: string } }) {
  const { locale, slug } = params;
  const post = POSTS[slug];
  if (!post) notFound();

  const relatedSlugs = Object.keys(POSTS).filter(s => s !== slug).slice(0, 2);

  return (
    <article className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-24">
      {/* Hero image */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-obsidian via-transparent to-black/30" />
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-24 relative z-10 pb-24">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-gold-500 text-white text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
            {post.tag}
          </span>
          <span className="text-neutral-400 font-sans text-xs">{post.date}</span>
          <span className="text-neutral-400 font-sans text-xs">· {post.readTime} read</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#0A0A0A] dark:text-white leading-tight mb-8">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-4 py-6 border-y border-neutral-100 dark:border-neutral-800 mb-10">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold-500/30">
            <Image
              src={post.authorImage}
              alt={post.author}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-heading text-sm text-[#0A0A0A] dark:text-white">{post.author}</div>
            <div className="text-neutral-400 text-xs font-sans">{post.authorRole}</div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6">
          <p className="font-display text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
            {post.excerpt}
          </p>
          <div className="w-12 h-px bg-gold-500" />
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-neutral-600 dark:text-neutral-400 font-sans text-base sm:text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-4">
          <span className="text-xs tracking-widest uppercase font-sans text-neutral-400">Share this story</span>
          <div className="flex gap-3">
            {["Twitter", "Facebook", "LinkedIn"].map(s => (
              <button key={s} className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-sans text-neutral-500 hover:border-gold-500 hover:text-gold-500 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Related posts */}
      {relatedSlugs.length > 0 && (
        <div className="bg-neutral-50 dark:bg-neutral-950 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="section-label mb-6">Continue Reading</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedSlugs.map(rSlug => {
                const rPost = POSTS[rSlug];
                return (
                  <Link key={rSlug} href={`/${locale}/blog/${rSlug}`} className="group">
                    <div className="relative h-44 overflow-hidden rounded-xl mb-4">
                      <Image
                        src={rPost.image}
                        alt={rPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <span className="text-gold-500 text-[10px] font-sans tracking-widest uppercase">{rPost.tag}</span>
                    <h3 className="font-heading text-lg text-[#0A0A0A] dark:text-white mt-1 group-hover:text-gold-500 transition-colors leading-snug">
                      {rPost.title}
                    </h3>
                    <p className="text-neutral-400 text-sm font-sans mt-2 line-clamp-2">{rPost.excerpt}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
