import { useAuth } from "@/utils/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  return logout();
}
