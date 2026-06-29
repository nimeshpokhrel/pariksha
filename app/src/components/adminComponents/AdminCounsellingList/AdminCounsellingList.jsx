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
import { getCounsellings } from "@/hooks/admin/counselling";

export default function AdminCounsellingList() {
  const {
    data: counsellings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["counsellings"],
    queryFn: () => getCounsellings(),
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
        <h1 className="text-xl font-bold">Counselling Requests</h1>
      </div>

      {isLoading && <Spinner />}
      {isError && (
        <p className="text-sm text-red-500">
          Failed to load counselling requests.
        </p>
      )}

      {counsellings && counsellings.length === 0 && (
        <p className="text-sm text-gray-500">No counselling requests yet.</p>
      )}

      {counsellings && counsellings.length > 0 && (
        <div className="rounded-lg border border-solid border-[#d1d7dc]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>+2 College</TableHead>
                <TableHead>Interested Degree</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {counsellings.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.contactNumber}</TableCell>
                  <TableCell>{item.plusTwoCollege}</TableCell>
                  <TableCell>{item.interestedDegree}</TableCell>
                  <TableCell>{item.address}</TableCell>
                  <TableCell className="capitalize">{item.status}</TableCell>
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
