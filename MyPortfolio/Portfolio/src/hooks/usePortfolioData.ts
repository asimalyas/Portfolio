import { useQuery } from "@tanstack/react-query";
import { fallbackPortfolioData, fetchPortfolioData } from "@/lib/portfolio-data";

export function usePortfolioData() {
  return useQuery({
    queryKey: ["portfolio-data"],
    queryFn: fetchPortfolioData,
    initialData: fallbackPortfolioData,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
}


