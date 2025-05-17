import React, { useState } from "react";
import { Ellipsis, PencilIcon, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConversationDialog from "./DeleteConversationDialog";
import { Conversation } from "@/types/conversations";

export default function ConversationDropdown({
  handleEditing,
  conversation,
  setConversations,
}: {
  handleEditing: (conversation: Conversation) => void;
  conversation: Conversation;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}) {
  // Control dropdown open state explicitly
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onDeleteClick = () => {
    setDropdownOpen(false); // close dropdown first
    // open dialog in next tick so dropdown is definitely closed
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 0);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="p-1 outline-none">
          <Ellipsis size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-5">
          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              handleEditing(conversation);
            }}
          >
            <div className="flex flex-row gap-3 items-center">
              <PencilIcon size={16} />
              <span>Rename</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteClick}>
            <div className="flex flex-row gap-3 items-center text-red-500">
              <Trash2 size={16} />
              <span>Delete</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConversationDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        conversation={conversation}
        setConversations={setConversations}
      />
    </div>
  );
}
