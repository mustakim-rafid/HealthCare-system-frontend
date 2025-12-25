export interface INavItem {
    title: string;
    url: string;
}

export interface INavMain {
    title: string;
    icon: string;
    isActive: boolean;
    items: INavItem[]
}