import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import RenderKatex from "@/components/RenderKatex";
import UploadThingImage from "../UploadThingImage";

export default function QuestionAnswerPreview({ answer, correct }) {
  return (
    <>
      {answer.text && (
        <div className="flex items-center gap-4">
          <Checkbox checked={correct} disabled={!correct} />
          {answer.type === "text" ? (
            <p>
              <RenderKatex text={answer.text} />
            </p>
          ) : (
            <UploadThingImage
              src={`${answer.text}`}
              alt="Answer Image"
              width={150}
              height={150}
            />
          )}
        </div>
      )}
    </>
  );
}
