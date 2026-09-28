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
    title: `شاركنا لحظتك | ${event.title}`,
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
    <div className="min-h-screen bg-gradient-to-b from-[#14120f] via-[#0d0c0a] to-[#080706] text-white py-8 px-4 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-6">
        <Link
          href={`/e/${event.slug}`}
          className="flex items-center gap-1.5 text-xs text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 px-3 py-1.5 rounded-full border border-[#d4af37]/30 transition-all font-semibold"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لصفحة الدعوة</span>
        </Link>

        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <span>لحظة</span>
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="my-auto">
        <PhotoUploader
          eventId={event.id}
          eventTitle={event.title}
          coupleNames={coupleNames}
        />
      </div>

      {/* Bottom info */}
      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2">
        <div className="flex items-center justify-center gap-1 text-xs text-neutral-500">
          <span>أدام الله الأفراح بدياركم العامرة</span>
          <Heart className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
        </div>
        <p className="text-[10px] text-neutral-600">منصة لحظة لتوثيق أسعد الذكريات</p>
      </div>
    </div>
  );
}
