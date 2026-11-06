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
    <div className="min-h-screen bg-[#FFF8F4] text-[#493B3B] py-8 px-4 flex flex-col justify-between selection:bg-[#790D20]/15 selection:text-[#390E19] font-sans">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-6">
        <Link
          href={`/e/${event.slug}`}
          className="flex items-center gap-1.5 text-xs text-[#8B7778] hover:text-[#790D20] transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لصفحة الدعوة</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-[#390E19] font-semibold">
          <span className="font-serif">لحظة</span>
          <Sparkles className="w-3 h-3 text-[#790D20]" />
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
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#8B7778]">
          <span>أدام الله الأفراح بدياركم العامرة</span>
          <Heart className="w-3 h-3 text-[#790D20] fill-[#790D20]" />
        </div>
        <p className="text-[10px] text-[#8B7778]/70 font-serif">منصة لحظة لتوثيق أسعد الذكريات</p>
      </div>
    </div>
  );
}
