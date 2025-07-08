import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SubscribeButton() {
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      size="sm"
      className="sm:text-sm text-foreground"
      onClick={() => {
        router.push("/subscribe");
      }}
    >
      Your Subscription is Inactive - Click to Subscribe
    </Button>
  );
}
