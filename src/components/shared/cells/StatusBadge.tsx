import { Badge } from "@/components/ui/badge";
import { Status } from "@/types/common";
import { capitalize } from "@/utils/formatters";

interface StatusBadgeProps {
    status: Status
}

const StatusBadge = ({status}: StatusBadgeProps) => {
  return (
    <Badge
      variant={
        status === "ACTIVE"
          ? "default"
          : status === "INACTIVE"
          ? "secondary"
          : "destructive"
      }
    >
      {capitalize(status)}
    </Badge>
  );
};

export default StatusBadge;
