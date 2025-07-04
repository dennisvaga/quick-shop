/**
 * Home Tab - Marketing/Discovery Focus
 * Features hero banners, quick categories, and featured products
 */

import * as React from "react";
import { HeroSection } from "~/components/home-page/HeroSection";
import { NewArrivals } from "~/components/home-page/NewArrivals";
import { useProducts } from "~/features/products/hooks/useProducts";
import AppHeader from "~/layout/AppHeader";
import { PageContainer } from "~/layout/PageContainer";

export default function HomeTab() {
  const [searchText, setSearchText] = React.useState("");

  // Get the products query for refresh functionality
  const { refetch: refetchNewArrivals, isRefetching } = useProducts({
    perPage: 10,
    orderBy: "date",
    order: "desc",
  });

  const handleRefresh = () => {
    refetchNewArrivals();
  };

  return (
    <PageContainer
      refreshing={isRefetching}
      onRefresh={handleRefresh}
      isTabScreen={true}
      paddingTop={false}
    >
      {/* Search Bar - visible on homepage */}
      {/* <SearchBar value={searchText} onChangeText={setSearchText} /> */}

      {/* Header with brand name only */}
      <AppHeader />

      {/* Hero Banner - Image Carousel */}
      <HeroSection />

      {/* New Arrivals Grid (2x5) */}
      <NewArrivals />
    </PageContainer>
  );
}
