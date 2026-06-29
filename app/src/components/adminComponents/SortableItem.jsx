"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import DeleteDialog from "../Dialog/DeleteDialog";
import Link from "next/link";

export function SortableItem({
  id,
  link,
  title,
  description,
  enableEdit,
  editDialog,
  handleDelete,
  blankTarget,
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
      <div className="flex flex-grow items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-semibold">
            <Link href={link} target={blankTarget ? "_blank" : "_self"}>
              {title}
            </Link>
          </h3>
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
