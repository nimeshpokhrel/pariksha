import { ArrowDown, Search } from "lucide-react";
import React from "react";
import { useGetResultMocktests } from "@/hooks/useGetResultMocktests";
import { useGetResult } from "@/hooks/useGetResult";
import { useToast } from "@/hooks/use-toast";

const MocktestResult = () => {
  const { toast } = useToast();

  const {
    data: mocktests,
    isLoading: isLoadingMocktests,
    isError: isErrorMocktests,
  } = useGetResultMocktests();

  const { mutate: getResult, isPending: isPendingGetResult } = useGetResult();

  const [queryData, setQueryData] = React.useState({
    symbol: "",
    mocktest: "",
  });

  const [result, setResult] = React.useState(null);

  const handleGetResult = () => {
    if (!queryData.symbol || !queryData.mocktest) {
      toast({
        title: "Error",
        description: "Please enter your symbol number and select a mock test.",
        variant: "destructive",
      });
      return;
    }
    getResult(
      {
        mocktest: queryData.mocktest,
        symbol_no: queryData.symbol,
      },
      {
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message + ".",
            variant: "destructive",
          });
        },
        onSuccess: (data) => {
          setResult(data.result);
        },
      },
    );
  };

  React.useEffect(() => {
    if (mocktests?.mocktests?.length > 0) {
      setQueryData((prev) => ({
        ...prev,
        mocktest: mocktests.mocktests[0],
      }));
    }
  }, [mocktests]);

  if (isLoadingMocktests || isErrorMocktests) return null;

  return (
    <div className="mx-auto flex min-h-[40vh] items-center justify-center bg-[#F8FAFC] px-4 md:min-h-[50vh]">
      <div>
        <div
          className={`leading-12 md:leading-14 w-full text-center text-4xl font-bold`}
        >
          Check Your <span className="relative text-[#fe8d01]">Result</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="md:text-normal mt-5 max-w-[500px] text-center text-base leading-8 text-gray-700 md:mt-6">
            Check your physical mock test results and track your progress to
            improve your performance.
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGetResult();
            }}
            className="relative w-full md:w-[500px]"
          >
            <input
              placeholder="Enter Your Symbol Number"
              value={queryData.symbol}
              onChange={(e) =>
                setQueryData((prev) => ({
                  ...prev,
                  symbol: e.target.value,
                }))
              }
              className="w-full rounded-full border border-gray-200 px-5 py-4 text-sm text-black outline-none"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-end gap-2 rounded-full text-sm font-medium">
              <select
                value={queryData.mocktest}
                onChange={(e) =>
                  setQueryData((prev) => ({
                    ...prev,
                    mocktest: e.target.value,
                  }))
                }
                className="border-none py-2 pe-6 ps-3 text-gray-700 outline-none"
              >
                {mocktests.mocktests.map((mocktest, i) => (
                  <option key={mocktest + `-${i}`} value={mocktest}>
                    {mocktest}
                  </option>
                ))}
              </select>
              <ArrowDown
                size={16}
                color="#fff"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </form>
          <button
            type="submit"
            onClick={handleGetResult}
            disabled={isPendingGetResult}
            className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full bg-[#007e88] text-sm font-semibold text-white hover:bg-[#00656e]"
          >
            <Search size={16} />
          </button>
        </div>
        {result && (
          <table className="mx-auto mt-10">
            <thead>
              <tr>
                <th className="border px-4 py-2">SN</th>
                <th className="border px-4 py-2">Mock Test</th>
                <th className="border px-4 py-2">Symbol No</th>
                <th className="border px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">{result.mocktest}</td>
                <td className="border px-4 py-2">
                  {result.results[0].symbolNo}
                </td>
                <td className="border px-4 py-2">{result.results[0].score}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MocktestResult;
