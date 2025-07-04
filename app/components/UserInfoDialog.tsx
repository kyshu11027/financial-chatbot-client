import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import UserInfoForm from "@/app/components/UserInfoForm";
import { useUser } from "@/app/context/UserContext";

export default function UserInfoDialog() {
  const { userInfo } = useUser();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <PiggyBank />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>Open Financial Info</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="max-h-[75vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>My Financial Information & Goals</DialogTitle>
          <DialogDescription>
            This data will be used to help provide you with personalized
            financial advice.
          </DialogDescription>
        </DialogHeader>
        <UserInfoForm userInfo={userInfo} setOpenDialog={setOpenDialog} />
      </DialogContent>
    </Dialog>
  );
}
