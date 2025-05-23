import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Confirmation() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            First, confirm your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          A confirmation email has been sent. Please confirm your email, then
          log in with your credentials.
        </CardContent>
      </Card>
    </div>
  );
}
