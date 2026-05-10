import { getAllBooks, getFeaturedBook, getComingSoonBooks } from "@/lib/books";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedBookSection from "@/components/sections/FeaturedBookSection";
import ComingSoonSection from "@/components/sections/ComingSoonSection";
import CatalogueSection from "@/components/sections/CatalogueSection";
import AudioSection from "@/components/sections/AudioSection";
import AmazonSection from "@/components/sections/AmazonSection";
import AuthorSection from "@/components/sections/AuthorSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export const revalidate = 3600;

export default async function HomePage() {
  const [allBooks, featuredBook, comingSoonBooks] = await Promise.all([
    getAllBooks(),
    getFeaturedBook(),
    getComingSoonBooks(),
  ]);

  return (
    <>
      <HeroSection />
      <FeaturedBookSection book={featuredBook} />
      <ComingSoonSection books={comingSoonBooks} />
      <CatalogueSection books={allBooks} />
      <AudioSection />
      <AmazonSection />
      <AuthorSection />
      <TestimonialsSection />
    </>
  );
}
