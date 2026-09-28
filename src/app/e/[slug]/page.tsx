import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/lib/templates";
import InvitationView from "@/components/templates/InvitationView";

interface PageProps {
  params: Promise<{ slug: string }>;
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

  return {
    title: `${event.title} | لحظة`,
    description: `يتشرف ${event.groomName} و ${event.brideName} بدعوتكم لحضور حفل الزفاف في ${event.venueName}. تفاصيل الدعوة وتأكيد الحضور.`,
    openGraph: {
      title: event.title,
      description: `ندعوكم بكل الحب لمشاركتنا فرحة العمر في ${event.venueName}`,
      locale: "ar_EG",
      type: "website",
    },
  };
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
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

  const templateConfig = getTemplate(event.templateId);

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
