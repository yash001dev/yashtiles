import FrameItHeader from '@/components/dashboard/FrameItHeader'

export default function PrivacyPolicyPage() {
  return (
    <>
      <FrameItHeader />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Personal identification information (Name, email address, phone number, etc.)</li>
          <li>Order and payment information</li>
          <li>Usage data and cookies</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your orders and our services</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Sharing Your Information</h2>
        <p className="mb-4">We do not sell your personal information. We may share your information with third parties only to provide our services (such as payment processors and shipping partners) or as required by law.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Access, update, or delete your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Request information about how your data is used</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="/contact" className="text-primary underline">our contact page</a>.</p>
      </main>
    </>
  )
} 