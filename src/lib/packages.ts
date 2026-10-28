// src/lib/packages.ts - Commercial Tier Configuration & Payment Gateway Architecture
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export interface PackageTier {
  code: "BASIC" | "PREMIUM" | "LUXURY";
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  price: number;
  currency: string;
  photoLimit: number;
  isPopular?: boolean;
  features: string[];
}

export const PACKAGES: Record<string, PackageTier> = {
  BASIC: {
    code: "BASIC",
    nameAr: "الباقة الأساسية",
    nameEn: "Basic",
    taglineAr: "مناسبة للاحتفالات العائلية الصغيرة وعقد القران",
    price: 399,
    currency: "ج.م",
    photoLimit: 150,
    features: [
      "دعوة إلكترونية تفاعلية برابط خاص",
      "تأكيد الحضور (RSVP) وإحصائيات الحضور",
      "رمز QR مخصص للطباعة",
      "مشاركة حتى 150 صورة من الضيوف",
      "لوحة مراجعة وموافقة على الصور",
      "صلاحية المعرض لمدة 3 أشهر",
    ],
  },
  PREMIUM: {
    code: "PREMIUM",
    nameAr: "الباقة المميزة",
    nameEn: "Premium",
    taglineAr: "الخيار المثالي لحفلات الزفاف والخطوبة الراقية",
    price: 799,
    currency: "ج.م",
    photoLimit: 500,
    isPopular: true,
    features: [
      "كل مميزات الباقة الأساسية",
      "جميع القوالب الملكية والفاخرة مفتوحة",
      "مشاركة حتى 500 صورة بجودة فائقة",
      "لوحة تحكم متقدمة مع تصدير بيانات الحضور",
      "تصميم بطاقة طاولة جاهزة للطباعة مع الـ QR",
      "صلاحية المعرض مدى الحياة",
      "دعم فني سريع عبر الواتساب",
    ],
  },
  LUXURY: {
    code: "LUXURY",
    nameAr: "الباقة الملكية",
    nameEn: "Luxury VIP",
    taglineAr: "تجربة ملكية استثنائية متكاملة لأفخم المناسبات",
    price: 1399,
    currency: "ج.م",
    photoLimit: 2000,
    features: [
      "كل مميزات الباقة المميزة",
      "مشاركة صور غير محدودة تقريباً (حتى 2000 صورة)",
      "تخصيص رابط مميز مخصص (Custom URL)",
      "شاشة عرض حي للصور خلال الحفل (Live Photo Wall)",
      "تحميل الألبوم بالكامل بضغطة زر بدقة أصلية",
      "تنسيق مخصص من مصممي لحظة المحترفين",
      "دعم ومتابعة مخصصة يوم الحفل",
    ],
  },
};

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  packageCode: string;
  eventId: string;
  checkoutUrl?: string;
  isSimulated: boolean;
  message?: string;
}

export interface IPaymentGateway {
  charge(eventId: string, packageCode: string): Promise<PaymentResult>;
  handleWebhook(payload: Record<string, unknown>, signature: string): Promise<{
    verified: boolean;
    eventId?: string;
    packageCode?: string;
    status?: PaymentStatus;
  }>;
}

/**
 * Development & Testing Simulation Gateway.
 * NOTICE: Strictly for development, automated CI tests, and product demos.
 */
class SimulationPaymentGateway implements IPaymentGateway {
  async charge(eventId: string, packageCode: string): Promise<PaymentResult> {
    const tier = PACKAGES[packageCode];
    if (!tier) throw new Error("باقة غير صالحة");

    const txnId = `SIM-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create record in database and update package tier atomically
    const [, txn] = await prisma.$transaction([
      prisma.event.update({
        where: { id: eventId },
        data: { packageTier: packageCode, isPaid: true },
      }),
      prisma.paymentTransaction.create({
        data: {
          eventId,
          packageCode,
          amount: tier.price,
          currency: "EGP",
          status: "PAID",
          provider: "SIMULATION",
          providerTxnId: txnId,
          metadata: JSON.stringify({ isSimulated: true, tierName: tier.nameAr }),
        },
      }),
    ]);

    return {
      success: true,
      transactionId: txn.providerTxnId || txnId,
      status: "PAID",
      packageCode,
      eventId,
      isSimulated: true,
      message: `تم ترقية المناسبة بنجاح إلى ${tier.nameAr}!`,
    };
  }

  async handleWebhook(): Promise<{ verified: boolean }> {
    return { verified: true };
  }
}

/**
 * Paymob Configuration Validation & Environment Status
 * Checks all 4 required Paymob parameters without exposing sensitive values.
 */
export interface PaymobConfigStatus {
  isConfigured: boolean;
  isReady: boolean;
  hasApiKey: boolean;
  hasIntegrationId: boolean;
  hasIframeId: boolean;
  hasHmacSecret: boolean;
  missingVariables: string[];
}

export function getPaymobConfigStatus(): PaymobConfigStatus {
  const apiKey = (process.env.PAYMOB_API_KEY || "").trim();
  const integrationId = (process.env.PAYMOB_INTEGRATION_ID || "").trim();
  const iframeId = (process.env.PAYMOB_IFRAME_ID || "").trim();
  const hmacSecret = (process.env.PAYMOB_HMAC_SECRET || "").trim();

  const missingVariables: string[] = [];
  if (!apiKey) missingVariables.push("PAYMOB_API_KEY");
  if (!integrationId) missingVariables.push("PAYMOB_INTEGRATION_ID");
  if (!iframeId) missingVariables.push("PAYMOB_IFRAME_ID");
  if (!hmacSecret) missingVariables.push("PAYMOB_HMAC_SECRET");

  const isConfigured = missingVariables.length === 0;

  return {
    isConfigured,
    isReady: isConfigured,
    hasApiKey: !!apiKey,
    hasIntegrationId: !!integrationId,
    hasIframeId: !!iframeId,
    hasHmacSecret: !!hmacSecret,
    missingVariables,
  };
}

export function isPaymobReady(): boolean {
  return getPaymobConfigStatus().isConfigured;
}

/**
 * Paymob Payment Gateway Adapter (Production-ready).
 * Full architecture implementing Paymob API v1:
 * 1. Authentication Token -> 2. Order Registration -> 3. Payment Key Generation -> 4. Checkout Iframe -> 5. Webhook HMAC Validation.
 */
class PaymobPaymentGateway implements IPaymentGateway {
  private get apiKey() { return (process.env.PAYMOB_API_KEY || "").trim(); }
  private get integrationId() { return (process.env.PAYMOB_INTEGRATION_ID || "").trim(); }
  private get iframeId() { return (process.env.PAYMOB_IFRAME_ID || "").trim(); }
  private get hmacSecret() { return (process.env.PAYMOB_HMAC_SECRET || "").trim(); }

  async charge(eventId: string, packageCode: string): Promise<PaymentResult> {
    const config = getPaymobConfigStatus();
    if (!config.isConfigured) {
      throw new Error(
        `إعدادات بوابة الدفع Paymob غير مكتملة في الخادم. المتغيرات المفقودة: ${config.missingVariables.join(", ")}`
      );
    }

    const tier = PACKAGES[packageCode];
    if (!tier) throw new Error("باقة غير صالحة");

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { user: true },
    });
    if (!event) throw new Error("المناسبة غير موجودة");

    // 1. Get Auth Token from Paymob
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: this.apiKey }),
    });
    if (!authRes.ok) throw new Error("فشل الاتصال ببوابة الدفع (Paymob Auth)");
    const authData = await authRes.json();
    const token = authData.token;

    // 2. Register Order
    const amountCents = Math.round(tier.price * 100);
    const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: "false",
        amount_cents: amountCents.toString(),
        currency: "EGP",
        merchant_order_id: `LAH-${eventId}-${Date.now()}`,
        items: [
          {
            name: `Lahzah Package: ${tier.nameAr}`,
            amount_cents: amountCents.toString(),
            description: `ترقية مناسبة ${event.title} إلى ${tier.nameAr}`,
            quantity: "1",
          },
        ],
      }),
    });
    if (!orderRes.ok) throw new Error("فشل تسجيل أمر الدفع في Paymob");
    const orderData = await orderRes.json();

    // 3. Obtain Payment Key
    const nameParts = (event.user.name || "عميل لحظة").split(" ");
    const firstName = nameParts[0] || "عميل";
    const lastName = nameParts.slice(1).join(" ") || "لحظة";

    const keyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: amountCents.toString(),
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          apartment: "NA",
          email: event.user.email,
          floor: "NA",
          first_name: firstName,
          street: "NA",
          building: "NA",
          phone_number: "+201000000000",
          shipping_method: "PKG",
          postal_code: "NA",
          city: "Cairo",
          country: "EGY",
          last_name: lastName,
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: this.integrationId,
      }),
    });
    if (!keyRes.ok) throw new Error("فشل استخراج مفتاح الدفع");
    const keyData = await keyRes.json();
    const paymentKey = keyData.token;

    const providerTxnId = `PMOB-${orderData.id}`;

    // Record PENDING transaction in DB
    await prisma.paymentTransaction.create({
      data: {
        eventId,
        packageCode,
        amount: tier.price,
        currency: "EGP",
        status: "PENDING",
        provider: "PAYMOB",
        providerTxnId,
        metadata: JSON.stringify({ paymobOrderId: orderData.id, paymentKey }),
      },
    });

    const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentKey}`;

    return {
      success: true,
      transactionId: providerTxnId,
      status: "PENDING",
      packageCode,
      eventId,
      checkoutUrl,
      isSimulated: false,
      message: "تم تجهيز جلسة الدفع الآمنة",
    };
  }

  async handleWebhook(
    payload: Record<string, unknown>,
    receivedHmac: string
  ): Promise<{
    verified: boolean;
    eventId?: string;
    packageCode?: string;
    status?: PaymentStatus;
  }> {
    if (!this.hmacSecret) {
      console.warn("PAYMOB_HMAC_SECRET not configured. Webhook rejected.");
      return { verified: false };
    }

    interface PaymobWebhookObj {
      amount_cents?: string | number;
      created_at?: string;
      currency?: string;
      error_occured?: boolean | string;
      has_parent_transaction?: boolean | string;
      id?: number | string;
      integration_id?: number | string;
      is_3d_secure?: boolean | string;
      is_auth?: boolean | string;
      is_capture?: boolean | string;
      is_refunded?: boolean | string;
      is_standalone_payment?: boolean | string;
      is_voided?: boolean | string;
      order?: { id?: number | string };
      owner?: string | number;
      pending?: boolean | string;
      source_data?: {
        pan?: string;
        sub_type?: string;
        type?: string;
      };
      success?: boolean | string;
    }

    const rawObj = (payload.obj || payload) as PaymobWebhookObj;
    const obj = rawObj;

    // Build HMAC concatenation string strictly in Paymob's mandated alphabetical key order
    const hmacString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id,
      obj.owner,
      obj.pending,
      obj.source_data?.pan,
      obj.source_data?.sub_type,
      obj.source_data?.type,
      obj.success,
    ].join("");

    const calculatedHmac = crypto
      .createHmac("sha512", this.hmacSecret)
      .update(hmacString)
      .digest("hex");

    if (calculatedHmac.toLowerCase() !== receivedHmac.toLowerCase()) {
      return { verified: false };
    }

    // Determine status
    let status: PaymentStatus = "FAILED";
    if (obj.success === true || obj.success === "true") {
      status = "PAID";
    } else if (obj.is_refunded === true) {
      status = "REFUNDED";
    }

    const paymobOrderId = obj.order?.id;
    const providerTxnId = `PMOB-${paymobOrderId}`;

    const existingTxn = await prisma.paymentTransaction.findUnique({
      where: { providerTxnId },
      include: { event: true },
    });

    if (existingTxn) {
      if (status === "PAID") {
        // Upgrade event atomically
        await prisma.$transaction([
          prisma.paymentTransaction.update({
            where: { id: existingTxn.id },
            data: { status: "PAID" },
          }),
          prisma.event.update({
            where: { id: existingTxn.eventId },
            data: { packageTier: existingTxn.packageCode, isPaid: true },
          }),
        ]);
      } else {
        await prisma.paymentTransaction.update({
          where: { id: existingTxn.id },
          data: { status },
        });
      }

      return {
        verified: true,
        eventId: existingTxn.eventId,
        packageCode: existingTxn.packageCode,
        status,
      };
    }

    return { verified: true, status };
  }
}

/**
 * Fail-closed gateway for production environments when legitimate payment gateway is unconfigured.
 * Prevents unauthorized simulated payments in production under all conditions.
 */
export class UnconfiguredProductionPaymentGateway implements IPaymentGateway {
  async charge(_eventId?: string, _packageCode?: string): Promise<PaymentResult> {
    void _eventId;
    void _packageCode;
    throw new Error(
      "بوابة الدفع غير مهيأة للإنتاج أو ناقصة الإعدادات. محاكاة الدفع معطلة تماماً في بيئة الإنتاج."
    );
  }

  async handleWebhook(): Promise<{ verified: boolean }> {
    return { verified: false };
  }
}

export function getPaymentGateway(): IPaymentGateway {
  const isProd = process.env.NODE_ENV === "production";
  const isPaymob = process.env.PAYMENT_PROVIDER === "paymob";

  if (isProd) {
    // In production, simulation is strictly forbidden under any circumstances.
    // Must use real, fully configured Paymob or fail closed.
    if (isPaymob && isPaymobReady()) {
      return new PaymobPaymentGateway();
    }
    return new UnconfiguredProductionPaymentGateway();
  }

  // Non-production environments (development / test)
  if (isPaymob && isPaymobReady()) {
    return new PaymobPaymentGateway();
  }

  return new SimulationPaymentGateway();
}

export async function processPayment(eventId: string, packageCode: string): Promise<PaymentResult> {
  return getPaymentGateway().charge(eventId, packageCode);
}

export async function verifyAndProcessWebhook(
  payload: Record<string, unknown>,
  signature: string
) {
  return getPaymentGateway().handleWebhook(payload, signature);
}
