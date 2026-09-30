import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/lib/templates";
import InvitationView from "@/components/templates/InvitationView";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ template?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const event = await prisma.event.findUnique({
    where: { slug: decodedSlug },
  });

  if (!event) {
    return {
      title: "الدعوة غير موجودة | لحظة",
    };
  }

  const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonicalUrl = `${hostUrl}/e/${event.slug}`;
  const ogImage = event.coverImage || `${hostUrl}/icon.png`;

  return {
    title: `${event.title} | لحظة`,
    description: `يتشرف ${event.groomName} و ${event.brideName} بدعوتكم لحضور حفل الزفاف في ${event.venueName}. تفاصيل الدعوة وتأكيد الحضور.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: event.title,
      description: `ندعوكم بكل الحب لمشاركتنا فرحة العمر في ${event.venueName}`,
      url: canonicalUrl,
      siteName: "لحظة - منصة دعوات الزفاف وتوثيق الذكريات",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      locale: "ar_EG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: `ندعوكم بكل الحب لمشاركتنا فرحة العمر في ${event.venueName}`,
      images: [ogImage],
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const templateOverride = resolvedSearchParams.template;
  const decodedSlug = decodeURIComponent(slug);

  const event = await prisma.event.findUnique({
    where: { slug: decodedSlug },
    include: {
      photos: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          rsvps: true,
          photos: {
            where: { status: "APPROVED" },
          },
        },
      },
    },
  });

  if (!event || !event.isPublished) {
    notFound();
  }

  const templateConfig = getTemplate(templateOverride || event.templateId);

  const eventData = {
    id: event.id,
    slug: event.slug,
    title: event.title,
    eventType: event.eventType,
    groomName: event.groomName,
    brideName: event.brideName,
    eventDate: event.eventDate,
    venueName: event.venueName,
    address: event.address,
    mapUrl: event.mapUrl,
    welcomeMessage: event.welcomeMessage,
    description: event.description,
    coverImage: event.coverImage,
    templateConfig,
    approvedPhotos: event.photos,
    stats: {
      approvedPhotosCount: event._count.photos,
      totalRsvps: event._count.rsvps,
    },
  };

  return <InvitationView event={eventData} />;
}
