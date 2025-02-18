import { BiError, BiSearchAlt } from "react-icons/bi";
import {
  FaBookOpen,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaPlaneArrival,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa6";
import { HiDocumentArrowDown, HiDocumentPlus } from "react-icons/hi2";
import { MdHomeFilled, MdNearbyError } from "react-icons/md";
import { RiAdminFill, RiUserAddFill } from "react-icons/ri";
import { cabangList } from "./branchList";
import { IoPerson } from "react-icons/io5";

const navMenuIconSize = 20;
const navSubMenuIconSize = 18;

export const navbarMenus = [
  {
    label: "Last Mile",
    req: 1,
    allowedOrigin: cabangList.map((cabang) => cabang.name),
    icon: <FaWarehouse size={navMenuIconSize} />,
    items: [
      {
        label: "Dashboard",
        link: "/",
        req: 1,
        icon: <MdHomeFilled size={navSubMenuIconSize} />,
      },
      {
        label: "Manifest Transit",
        link: "/create",
        req: 1,
        icon: <HiDocumentPlus size={navSubMenuIconSize} />,
      },
      {
        label: "Unreceived",
        link: "/unreceived",
        req: 1,
        icon: <BiError size={navSubMenuIconSize} />,
      },
      {
        label: "Penarikan Data",
        link: "/get",
        req: 2,
        icon: <HiDocumentArrowDown size={navSubMenuIconSize} />,
      },
      {
        label: "Cari",
        link: "/find",
        req: 1,
        icon: <BiSearchAlt size={navSubMenuIconSize} />,
      },
    ],
  },
  {
    label: "Mid Mile",
    req: 2,
    allowedOrigin: ["MATARAM", "BANDARA"],
    icon: <FaPlaneArrival size={navMenuIconSize} />,
    items: [
      {
        label: "Dashboard",
        link: "/mm",
        req: 1,
        icon: <MdHomeFilled size={navSubMenuIconSize} />,
      },
      {
        label: "Input Data",
        link: "/mm/create",
        req: 1,
        icon: <HiDocumentPlus size={navSubMenuIconSize} />,
      },
      {
        label: "Cari",
        link: "/mm/find",
        req: 1,
        icon: <BiSearchAlt size={navSubMenuIconSize} />,
      },
    ],
  },
  {
    label: "EMPU",
    req: 2,
    allowedOrigin: ["BANDARA", "MATARAM"],
    icon: <FaBoxOpen size={navMenuIconSize} />,
    items: [
      {
        label: "Dashboard",
        link: "/empu",
        req: 1,
        icon: <MdHomeFilled size={navSubMenuIconSize} />,
      },
      {
        label: "New Transactions",
        link: "/empu/add",
        req: 1,
        icon: <FaFileInvoiceDollar size={navSubMenuIconSize} />,
      },
      {
        label: "Customers",
        link: "/empu/customers",
        req: 1,
        icon: <IoPerson size={navSubMenuIconSize} />,
      },
      {
        label: "Find",
        link: "/empu/find",
        req: 1,
        icon: <BiSearchAlt size={navSubMenuIconSize} />,
      },
    ],
  },
  {
    label: "Manual Book",
    req: 1,
    allowedOrigin: cabangList.map((cabang) => cabang.name),
    icon: <FaBookOpen size={navMenuIconSize} />,
    items: [
      {
        label: "Mid Mile",
        link: "https://e-mts-manualbook.tiiny.site/",
        req: 1,
        icon: <FaPlaneArrival size={navSubMenuIconSize} />,
      },
    ],
  },
  {
    label: "Muatan Vendor",
    req: 1,
    allowedOrigin: "VENDOR",
    icon: <FaTruck size={navMenuIconSize} />,
    items: [
      {
        label: "Dashboard",
        link: "/v",
        req: 1,
        icon: <MdHomeFilled size={navSubMenuIconSize} />,
      },
      {
        label: "Penarikan Data",
        link: "/get",
        req: 1,
        icon: <HiDocumentArrowDown size={navSubMenuIconSize} />,
      },
    ],
  },
  {
    label: "Admin",
    req: 5,
    allowedOrigin: "MATARAM",
    icon: <RiAdminFill size={navMenuIconSize} />,
    items: [
      {
        label: "Vendor",
        link: "/v",
        req: 1,
        icon: <MdHomeFilled size={navSubMenuIconSize} />,
      },
      {
        label: "Error MTS",
        link: "/error",
        req: 5,
        icon: <MdNearbyError size={navSubMenuIconSize} />,
      },
      {
        label: "Registrasi User",
        link: "/add",
        req: 5,
        icon: <RiUserAddFill size={navSubMenuIconSize} />,
      },
    ],
  },
];
