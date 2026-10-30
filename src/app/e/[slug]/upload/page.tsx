import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PhotoUploader from "@/components/guest/PhotoUploader";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const event = await prisma.event.findUnique({
    where: { slug: decodedSlug },
  });

  if (!event) return { title: "المناسبة غير موجودة | لحظة" };

  return {
    title: `شاركنا لحظتك - شاركنا لحظة من يومنا | ${event.title}`,
    description: `التقط وشارك أجمل صورك في حفل زفاف ${event.groomName} و ${event.brideName}`,
  };
}

export default async function GuestUploadPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const event = await prisma.event.findUnique({
    where: { slug: decodedSlug },
  });

  if (!event || !event.isPublished) {
    notFound();
  }

  const coupleNames = `${event.groomName} و ${event.brideName}`;

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#493B38] py-8 px-4 flex flex-col justify-between selection:bg-[#F27D72]/20 selection:text-[#51354F]">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-6">
        <Link
          href={`/e/${event.slug}`}
          className="flex items-center gap-1.5 text-xs text-[#786C68] hover:text-[#F27D72] transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لصفحة الدعوة</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-[#51354F] font-semibold">
          <span className="font-serif">لحظة</span>
          <Sparkles className="w-3 h-3 text-[#F27D72]" />
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="my-auto py-4">
        <PhotoUploader
          eventId={event.id}
          eventTitle={event.title}
          coupleNames={coupleNames}
        />
      </div>

      {/* Bottom info */}
      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#786C68]">
          <span>أدام الله الأفراح بدياركم العامرة</span>
          <Heart className="w-3 h-3 text-[#F27D72] fill-[#F27D72]" />
        </div>
        <p className="text-[10px] text-[#A89F95] font-serif">منصة لحظة لتوثيق أسعد الذكريات</p>
      </div>
    </div>
  );
}
