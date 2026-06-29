import { useState } from "react";
import { apiUrl } from "@/lib/config";
import { SearchBar } from "@/components/SearchBar";
import { BlogCardType } from "@/types/types";
import { BlogCard } from "@/components/BlogCard";

export default function BlogsPage({ blogs }: { blogs: BlogCardType[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8 space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Read Blogs</h1>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-12 max-w-2xl">
          <SearchBar onSearch={setSearchQuery} placeholder="Search For Blogs" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredBlogs.map((blog, index) => (
            <BlogCard key={blog._id + index} {...blog} />
          ))}
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">No blogs found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(`${apiUrl}/blog`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const blogsData = await res.json();

    return {
      props: {
        blogs: [...blogsData.blogs],
      },
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return {
      props: {
        blogs: [],
      },
    };
  }
}