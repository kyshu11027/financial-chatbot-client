import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function ConsentDialog({
  open,
  onAgree,
}: {
  open: boolean;
  onAgree: () => void;
}) {
  const [consentChecked, setConsentChecked] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent hideClose disableOutsideClick disableEscapeKeyDown>
        <DialogHeader>
          <DialogTitle>
            User Consent for Accessing and Storing Bank Data
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          By using our service, you agree to grant us permission to access, use,
          and store your bank account and transaction data for the purpose of
          providing personalized financial insights and services.
          <br />
          <br />
          We use Plaid Inc. to securely connect to your financial accounts. By
          linking your bank account, you acknowledge and agree to Plaid's
          Privacy Policy, which explains how your data is collected, used, and
          stored by Plaid.
          <br />
          <br />
          <b>Please note the following:</b>
          <br />
          <ul className="list-disc pl-5">
            <li>
              <b>Data Collected:</b> Through Plaid, we access your bank account
              information and transaction history.
            </li>
            <li>
              <b>Purpose:</b> Your data is used solely to deliver features such
              as financial tracking, insights, and personalized recommendations.
            </li>
            <li>
              <b>Data Storage:</b> Your data is stored securely and is not
              shared with third parties without your explicit consent.
            </li>
            <li>
              <b>Data Deletion:</b> If you choose to delete your account, all of
              your bank account and transaction data will be permanently deleted
              from our systems, and we will no longer have access to your
              financial accounts through Plaid.
            </li>
          </ul>
          <br />
          By continuing to use our service, you acknowledge and consent to the
          access, use, and storage of your bank data via Plaid as described
          above.
        </div>
        <div className="flex flex-row items-center gap-3 mt-4">
          <Checkbox
            id="consent"
            checked={consentChecked}
            onCheckedChange={() => setConsentChecked((prev) => !prev)}
          />
          <label htmlFor="consent" className="text-sm">
            I agree to the User Consent for Accessing and Storing Bank Data and{" "}
            <a
              className="text-blue-500"
              href="https://plaid.com/legal/#end-user-privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Plaid's Privacy Policy.
            </a>
          </label>
        </div>
        <Button
          className="mt-4 w-full"
          disabled={!consentChecked}
          onClick={onAgree}
        >
          Agree and Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
