import { useEffect } from "react";

const useInfiniteScroll = ({
  loading,
  refetch
}: {
  loading: boolean;
  refetch: () => void;
}) => {
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    refetch();
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
};

export default useInfiniteScroll;
