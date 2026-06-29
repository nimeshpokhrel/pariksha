"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { changeUserAdsSettings, getAllUsers } from "@/hooks/admin/users";
import withAuthSuperAdmin from "@/utils/withAuthSuperAdmin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateFull(dateString) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

function Users() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  // Local state to control input field value
  const [searchInput, setSearchInput] = useState(search);

  // Debounced function to update URL query param and reset page to 1
  const updateSearchQuery = useRef(
    debounce((value) => {
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      params.set("page", "1"); // reset to first page on search

      // Update URL without reloading page
      router.replace(`?${params.toString()}`);

      // No need to set debouncedSearch here as it comes from the URL directly now
    }, 500)
  ).current;

  // On input change: update local state and debounce update URL
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    updateSearchQuery(value);
  };

  // Sync searchInput state if URL search param changes externally
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const limit = 100;

  // Fetch users data based on page and search from URL params
  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getAllUsers({ page, limit, search }),
    keepPreviousData: true,
    placeholderData: () => {
      const cached = queryClient.getQueryData(["users", page, search]);
      return cached ?? undefined;
    },
    onSuccess: (data) => {
      if (data.page < data.pages) {
        queryClient.prefetchQuery({
          queryKey: ["users", data.page + 1, search],
          queryFn: () =>
            getAllUsers({
              page: data.page + 1,
              limit,
              search,
            }),
        });
      }
    },
  });

  // Generate pagination pages (same as before)
  const generatePagination = (currentPage, totalPages) => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxVisiblePages + 2);
      }

      if (start > 2) pages.push("ellipsis-start");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("ellipsis-end");

      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  // Pagination navigation handlers
  const setPage = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`);
  };

  const courseShortName = (courseName) => {
    switch (courseName) {
      case "BSc CSIT Entrance Preparation":
        return "CSIT";
      case "CMAT Preparation":
        return "CMAT";
      case "BIT Entrance Preparation":
        return "BIT";
      case "BCA Entrance Preparation":
        return "BCA";

      default:
        return courseName;
    }
  };

  const updateUserAds = useMutation({
    mutationFn: (data) => changeUserAdsSettings(data),
  });

  const handleAdsChange = (userId, value) => {
    updateUserAds.mutate({ userId, value });
  };

  return (
    <div className="content-container space-y-6 py-6">
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="flex flex-col justify-between gap-2 space-y-0 px-0 pb-4 pt-0 sm:flex-row sm:items-center">
          <CardTitle className="text-2xl font-bold">Users</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full pl-8"
              autoComplete="off"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          )}
          {data && (
            <>
              <div className="rounded-md border">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead className="w-[200px] whitespace-normal break-words">
                        Email
                      </TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="min-w-[100px] max-w-[300px]">
                        Enrolled Courses
                      </TableHead>
                      <TableHead className="min-w-[100px] max-w-[100px]">
                        Ads
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.users.map((user, index) => {
                        return (
                          <TableRow key={user._id}>
                            <TableCell>
                              {limit * (page - 1) + index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {user.fullName}
                            </TableCell>
                            <TableCell>{user.contactNumber || "—"}</TableCell>
                            <TableCell className="w-[200px] whitespace-normal break-words">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <TooltipProvider
                                delayDuration={0}
                                skipDelayDuration={0}
                              >
                                <Tooltip>
                                  <TooltipTrigger
                                    asChild
                                    className="cursor-pointer"
                                  >
                                    <p>{formatDate(user.createdAt)}</p>
                                  </TooltipTrigger>
                                  <TooltipContent sideOffset={-5}>
                                    <p>{formatDateFull(user.createdAt)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider
                                delayDuration={0}
                                skipDelayDuration={0}
                              >
                                <Tooltip>
                                  <TooltipTrigger
                                    asChild
                                    className="cursor-pointer"
                                  >
                                    <p>{formatDate(user.updatedAt)}</p>
                                  </TooltipTrigger>
                                  <TooltipContent sideOffset={-5}>
                                    <p>{formatDateFull(user.updatedAt)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="min-w-[100px] max-w-[200px]">
                              {user.enrolledCourses?.length > 0 &&
                                user.enrolledCourses
                                  .map((course) => courseShortName(course))
                                  .join(", ")}
                            </TableCell>
                            <TableCell className="min-w-[100px] max-w-[100px]">
                              <Switch
                                defaultChecked={user.adsEnabled}
                                onCheckedChange={(value) =>
                                  handleAdsChange(user._id, value)
                                }
                                disabled={updateUserAds.isPending}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 w-full overflow-x-auto">
                <Pagination>
                  <PaginationContent className="flex flex-wrap justify-center gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(page - 1, 1))}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {data.pages > 0 &&
                      generatePagination(page, data.pages).map(
                        (pageNum, idx) => (
                          <PaginationItem key={idx}>
                            {pageNum === "ellipsis-start" ||
                            pageNum === "ellipsis-end" ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                isActive={page === pageNum}
                                onClick={() =>
                                  typeof pageNum === "number" &&
                                  setPage(pageNum)
                                }
                                className={
                                  typeof pageNum === "number"
                                    ? "cursor-pointer"
                                    : ""
                                }
                              >
                                {pageNum}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        )
                      )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(page + 1, data.pages))}
                        className={
                          page === data.pages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="mt-2 text-center text-sm text-muted-foreground">
                  Showing page {data.page} of {data.pages} • {data.total} total
                  users
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuthSuperAdmin(Users);
