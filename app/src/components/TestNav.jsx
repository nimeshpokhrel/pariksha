import Countdown from "react-countdown";
import PrimaryButton from "@/components/PrimaryButton";

export default function TestNav({
  count,
  title,
  countdownDate,
  handleSubmit,
  onTimerEnd,
}) {
  return (
    <div className="border-b-2 border-b-gray-200 bg-white">
      <div className="content-container flex w-full flex-col gap-8 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-lg font-semibold"> {title}</p>
        <div className="flex items-center gap-10 max-sm:justify-between">
          <Countdown
            date={countdownDate}
            onComplete={onTimerEnd}
            renderer={({ hours, minutes, seconds }) => (
              <p>
                {hours <= 9 ? `0${hours}` : hours}:
                {minutes <= 9 ? `0${minutes}` : minutes}:
                {seconds <= 9 ? `0${seconds}` : seconds}
              </p>
            )}
          />

          <p>{count}/100</p>
          <PrimaryButton
            text={"End Test"}
            className={"w-max rounded-md"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
