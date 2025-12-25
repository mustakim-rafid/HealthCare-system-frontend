import { Column } from "@/components/shared/ManagementTable";
import { ISpeciality } from "@/types/speciality.interface";
import Image from "next/image";

export const specialityTableColumn: Column<ISpeciality>[] = [
    {
        header: "Title",
        accessor: "title",
    },
    {
        header: "Icon",
        accessor: (row) => <Image src={row.icon || "/no-icon-found.svg"} alt="specialityIcon" width={30} height={30} className="rounded-full overflow-hidden dark:bg-white" />,
    }
]