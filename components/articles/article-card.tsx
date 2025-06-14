import Image from "next/image";
import Link from "next/link";

type ArticleCardProps = {
  slug?: string;
  image: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
};

export default function ArticleCard({
  slug,
  image,
  date,
  title,
  excerpt,
  tags,
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} passHref>
      <div className="overflow-hidden rounded-lg border bg-white shadow hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="w-full h-48 relative">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        <div className="p-5 flex flex-col gap-2">
          <p className="text-sm text-gray-500">{date}</p>
          <h2 className="text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
