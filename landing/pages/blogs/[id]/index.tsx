import { BlogCard } from "@/components/BlogCard";
import { apiUrl } from "@/lib/config";
import { BlogCardType } from "@/types/types";
import { Clock } from "lucide-react";
import Image from "next/image";
import React from "react";

export async function getServerSideProps({ params }: { params: { id: string } }) {
  const trimmed_id = params.id.trim();

  try {
    // Fetch the main blog
    const res = await fetch(`${apiUrl}/blog/${trimmed_id}`);
    const blog = await res.json();

    // If the blog does not exist, return 404
    if (!blog || !blog.blog) {
      return { notFound: true };
    }

    // Fetch all blogs for "Some Other Blogs" section
    const other_blogs = await fetch(`${apiUrl}/blog`);
    const o_blogs = await other_blogs.json();

    // Filter out the current blog from other blogs
    const filtered_blogs = o_blogs.blogs.filter(
      (b: BlogCardType) => b._id !== trimmed_id
    );

    return {
      props: {
        blog: blog.blog,
        blogs: filtered_blogs,
      },
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { notFound: true };
  }
}

export default function BlogPage({
  blog,
  blogs,
}: {
  blog: BlogCardType;
  blogs: BlogCardType[];
}) {
  return (
    <div className="content-container container my-8">
      <div className="grid gap-8 md:grid-cols-10">
        {/* Main Blog Content */}
        <div className="md:col-span-7">
          {/* Blog Image */}
          <div className="overflow-hidden rounded-lg shadow">
            <Image
              src={blog.blogImageUrl}
              alt={blog.title}
              width={800}
              height={400}
              className="max-h-100 w-full object-contain"
              loading="lazy"
            />
          </div>

          {/* Date, Read Time, Tags */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex w-fit items-center justify-start gap-2 rounded bg-gradient-to-l from-[#fe8d01] to-[#04777f] px-2 py-1 text-xs font-medium text-white">
              <div>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              |
              <div className="flex items-center justify-start gap-1 capitalize">
                <Clock size={12} />
                {blog.readTime} min read
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              {blog.tags?.slice(0, 3).map((tag, i) => (
                <div
                  key={`tag-${i}-${tag}-${blog._id}`}
                  className="w-fit rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold capitalize text-black"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Blog Title & Description */}
          <div className="mt-4 text-base font-medium">{blog.title}</div>
          <div className="mt-2 text-sm font-medium text-gray-600">
            {blog.description}
          </div>

          {/* Blog Content */}
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Sidebar - Other Blogs */}
        <div className="md:col-span-3">
          <div>
            <div
              className="leading-12 md:leading-14 ms-1 w-full text-start text-xl font-bold"
            >
              Some Other <span className="relative text-[#fe8d01]">Blogs</span>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {blogs.map((b) => (
                <BlogCard key={b._id} {...b} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}