"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import DeleteDialog from "../Dialog/DeleteDialog";
import RenderKatex from "@/components/RenderKatex";

export function SortableItemNoLink({
  id,
  title,
  description,
  enableEdit,
  editDialog,
  handleDelete,
  deleteTitle,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-4 rounded-lg border bg-white p-4 shadow ${enableEdit ? "cursor-move" : ""}`}
    >
      {enableEdit && (
        <span {...attributes} {...listeners}>
          <GripVertical className="text-gray-400" />
        </span>
      )}
      <div className="flex flex-grow flex-col items-center justify-between gap-8 md:flex-row">
        <div>
          <p className=" ">
            <RenderKatex text={title} />
          </p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <DeleteDialog
              title={deleteTitle || "Are you sure you want to delete this ? "}
              description={title}
              returnId={id}
              deleteFunction={handleDelete}
            />
            {editDialog}
          </div>
        </div>
      </div>
    </li>
  );
}
