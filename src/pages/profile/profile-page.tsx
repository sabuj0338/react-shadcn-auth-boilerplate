import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router";

export default function ProfilePage() {
  const auth = useAuthStore((state) => state.auth);

  return (
    <Card className="rounded-none border-0 shadow-xs mt-3">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-gray-300">
              <AvatarImage src={auth?.user.avatar} />
              <AvatarFallback>{auth?.user.fullName?.slice(0,2)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-">
              <p className="text-2xl font-semibold">{auth?.user.fullName}</p>
              <p className="text-sm text-gray-500">{auth?.user.email || "--"}</p>
            </div>
          </div>
          <div className="flex justify-start md:justify-end gap-3">
            <Link to="/profile/edit"><Button>Edit Profile</Button></Link>
            {/* <Button className="" disabled>
              Change Password
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
