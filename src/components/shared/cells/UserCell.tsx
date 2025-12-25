import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatters";

interface UserCellProps {
  name: string;
  email: string;
  photoUrl?: string;
}

const UserCell = ({ name, email, photoUrl }: UserCellProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        {photoUrl ? (
          <AvatarImage src={photoUrl} alt={name} />
        ) : (
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-sm">{email}</span>
      </div>
    </div>
  );
};

export default UserCell