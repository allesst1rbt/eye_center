import { useNavigate } from "react-router-dom";

interface handleNavigateProps {
  route: string;
  replace?: boolean;
}

export const handleNavigate = ({ route, replace }: handleNavigateProps) => {
  const navigate = useNavigate();

  return navigate(route, { replace });
};
