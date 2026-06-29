import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";

export default function TestHistoryTable({ maxItems }) {
  const [historyItems, setHistoryItems] = useState([]);
  const { testHistory } = useAuth();
  const convertDate = (date) => {
    const localCreatedAt = new Date(date);
    const localDay = String(localCreatedAt.getDate()).padStart(2, "0");
    const localMonth = String(localCreatedAt.getMonth() + 1).padStart(2, "0");

    const localFormattedDate = `${localDay}/${localMonth}`;
    return localFormattedDate;
  };

  useEffect(() => {
    if (maxItems) {
      setHistoryItems(testHistory.slice(0, maxItems));
    } else {
      setHistoryItems(testHistory);
    }
  }, [testHistory]);

  return (
    <div className="mt-4">
      {(!historyItems || historyItems.length === 0) && (
        <div className="text-center">
          <p className="text-md w-full text-center text-gray-600">
            You have not completed any tests yet.
          </p>
        </div>
      )}
      {historyItems && historyItems.length > 0 && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Title</Th>
                <Th isNumeric> Score</Th>
                <Th isNumeric>Avg Score</Th>
                <Th>Course</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {historyItems &&
                historyItems.length > 0 &&
                historyItems.map((test, index) => (
                  <Tr key={index}>
                    <Td>
                      <Link
                        href={`/courses/${test.questionSetData.course.link}/tests/${test.questionSetData.link}`}
                      >
                        <PrimaryButton
                          text={"Retake Test"}
                          className={"w-max rounded"}
                        />
                      </Link>
                    </Td>
                    <Td>{test.questionSetData?.title}</Td>
                    <Td isNumeric>{test.score}</Td>
                    <Td isNumeric>
                      {parseFloat(test.questionSetData.avgScore.toFixed(2))}
                    </Td>
                    <Td>{test.questionSetData.course.title}</Td>
                    <Td>{convertDate(test.createdAt)}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
