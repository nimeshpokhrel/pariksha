import {
  FaCode,
  FaLaptopCode,
  FaMobileAlt,
  FaChartBar,
  FaServer,
  FaLock,
  FaCloud,
  FaTools,
  FaPencilRuler,
  FaBug,
  FaTasks,
  FaDatabase,
  FaRobot,
  FaGamepad,
  FaUserTie,
  FaBriefcase,
  FaCogs,
  FaBullhorn,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaChess,
  FaChartLine,
  FaChartPie,
  FaTruck,
  FaHeadset,
} from "react-icons/fa";

const icons = [
  {
    value: "software_developer",
    label: "Software Developer/Engineer",
    icon: <FaCode />,
  },
  {
    value: "web_developer",
    label: "Web Developer",
    icon: <FaLaptopCode />,
  },
  {
    value: "mobile_app_developer",
    label: "Mobile App Developer",
    icon: <FaMobileAlt />,
  },
  {
    value: "data_scientist",
    label: "Data Scientist/Analyst",
    icon: <FaChartBar />,
  },
  {
    value: "system_admin",
    label: "System/Network Administrator",
    icon: <FaServer />,
  },
  {
    value: "cybersecurity_specialist",
    label: "Cybersecurity Specialist",
    icon: <FaLock />,
  },
  {
    value: "cloud_engineer",
    label: "Cloud Engineer/Architect",
    icon: <FaCloud />,
  },
  { value: "devops_engineer", label: "DevOps Engineer", icon: <FaTools /> },
  {
    value: "ui_ux_designer",
    label: "UI/UX Designer",
    icon: <FaPencilRuler />,
  },
  {
    value: "qa_tester",
    label: "Quality Assurance/Tester",
    icon: <FaBug />,
  },
  {
    value: "it_project_manager",
    label: "IT Project Manager",
    icon: <FaTasks />,
  },
  {
    value: "database_administrator",
    label: "Database Administrator",
    icon: <FaDatabase />,
  },
  { value: "ai_ml_engineer", label: "AI/ML Engineer", icon: <FaRobot /> },
  { value: "game_developer", label: "Game Developer", icon: <FaGamepad /> },
  { value: "it_consultant", label: "IT Consultant", icon: <FaUserTie /> },

  {
    value: "business_manager",
    label: "Business Manager/Executive",
    icon: <FaBriefcase />,
  },
  {
    value: "operations_manager",
    label: "Operations Manager",
    icon: <FaCogs />,
  },
  {
    value: "marketing_manager",
    label: "Marketing Manager",
    icon: <FaBullhorn />,
  },
  {
    value: "hr_manager",
    label: "Human Resources Manager",
    icon: <FaUsers />,
  },
  {
    value: "finance_manager",
    label: "Finance Manager",
    icon: <FaMoneyBillWave />,
  },
  {
    value: "product_manager",
    label: "Product Manager",
    icon: <FaClipboardList />,
  },
  { value: "project_manager", label: "Project Manager", icon: <FaTasks /> },
  {
    value: "strategy_manager",
    label: "Strategy Manager",
    icon: <FaChess />,
  },
  { value: "sales_manager", label: "Sales Manager", icon: <FaChartLine /> },
  {
    value: "operations_analyst",
    label: "Operations Analyst",
    icon: <FaChartPie />,
  },
  {
    value: "supply_chain_manager",
    label: "Supply Chain Manager",
    icon: <FaTruck />,
  },
  {
    value: "customer_service_manager",
    label: "Customer Service Manager",
    icon: <FaHeadset />,
  },
  { value: "consultant", label: "Consultant/Advisor", icon: <FaUserTie /> },
];

export default function IconDisplay({ icon }: { icon: string }) {
  return icons.find((i) => i.value === icon)?.icon || null;
}
