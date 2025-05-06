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
import { useAuth } from "@/app/context/AuthContext";

export default function UserInfoDialog() {
  const { userInfo } = useAuth();

  return (
    <Dialog>
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Financial Information & Goals</DialogTitle>
          <DialogDescription>
            This data will be used to help provide you with personalized
            financial advice.
          </DialogDescription>
        </DialogHeader>
        <UserInfoForm userInfo={userInfo} />
      </DialogContent>
    </Dialog>
  );
}
