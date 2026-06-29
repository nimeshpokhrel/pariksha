"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { IoMdArrowBack } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/utils/Spinner";
import { getCollegeRecommendations } from "@/hooks/admin/collegeRecommend";

export default function AdminCollegeRecommendList() {
  const {
    data: recommendations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["college-recommendations"],
    queryFn: () => getCollegeRecommendations(),
  });

  return (
    <div className="flex flex-col gap-6 p-4 pt-8">
      <div>
        <Link
          href="/admin"
          className="mb-2 flex w-max items-center gap-1 text-sm text-gray-600 hover:text-black"
        >
          <IoMdArrowBack /> Back to Admin
        </Link>
        <h1 className="text-xl font-bold">College Recommendation Requests</h1>
      </div>

      {isLoading && <Spinner />}
      {isError && (
        <p className="text-sm text-red-500">
          Failed to load college recommendation requests.
        </p>
      )}

      {recommendations && recommendations.length === 0 && (
        <p className="text-sm text-gray-500">
          No college recommendation requests yet.
        </p>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="rounded-lg border border-solid border-[#d1d7dc]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Course Preference</TableHead>
                <TableHead>Desired College</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>{item.rank}</TableCell>
                  <TableCell>{item.coursePreference}</TableCell>
                  <TableCell>{item.desiredCollege}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.fees}</TableCell>
                  <TableCell>{item.reputationRequired}</TableCell>
                  <TableCell>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
