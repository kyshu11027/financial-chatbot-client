import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/conversations";
import { deleteConversation } from "@/lib/conversations";
import { useAuth } from "../context/AuthContext";
import { useParams, useRouter } from "next/navigation";

export default function DeleteConversationDialog({
  isDeleteDialogOpen,
  setDeleteDialogOpen,
  conversation,
  setConversations,
}: {
  isDeleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversation: Conversation;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const conversation_id =
    typeof params?.conversation_id === "string"
      ? params.conversation_id
      : undefined;

  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!isDeleteDialogOpen && cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
  }, [isDeleteDialogOpen]);

  const handleDelete = async () => {
    if (!session || loading) return;

    await deleteConversation(session.access_token, conversation.id);

    if (conversation_id === conversation.id) {
      setDeleteDialogOpen(false); // ensure UI is responsive
      router.push("/");
    }

    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversation.id)
    );

    setDeleteDialogOpen(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
