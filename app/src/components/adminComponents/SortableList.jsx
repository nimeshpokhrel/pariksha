"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function SortableListContainer({
  listItems,
  changeListItems,
  children,
  title,
  enableEdit,
  saveEdit,
  cancelEdit,
  onEditClick,
  addDialogExists,
  form,
  dialogOpen,
  setDialogOpen,
  addButtonTitle,
  addDialogTitle,
  fullScreenDialog,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      changeListItems((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={listItems.map((subject) => subject._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="mt-1 text-xl font-bold">{title}</p>

          <div className="flex items-center gap-4">
            {!enableEdit && (
              <>
                {addDialogExists && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <div className="flex justify-end">
                      <DialogTrigger className="flex w-max items-center gap-4 rounded-md bg-primary px-4 py-1.5 font-bold text-white max-[550px]:text-xs">
                        <FaPlus size={12} />
                        {addButtonTitle}
                      </DialogTrigger>
                    </div>
                    <DialogContent
                      className={fullScreenDialog ? "max-w-7xl" : "max-w-4xl"}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl font-semibold">
                          {addDialogTitle}
                        </DialogTitle>
                      </DialogHeader>
                      {form}
                    </DialogContent>
                  </Dialog>
                )}
                {listItems.length > 0 && (
                  <button
                    onClick={onEditClick}
                    className="flex items-center gap-2"
                  >
                    <FaEdit size={20} />
                  </button>
                )}
              </>
            )}
            {enableEdit && (
              <div>
                <Button className="mr-4" onClick={saveEdit}>
                  Save
                </Button>
                <Button variant="destructive" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
        <ul className="space-y-2">{children}</ul>
      </SortableContext>
    </DndContext>
  );
}
