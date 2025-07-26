import FrameItHeader from '@/components/dashboard/FrameItHeader'

export default function TermsOfServicePage() {
  return (
    <>
      <FrameItHeader />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">These Terms of Service govern your use of our website and services. By accessing or using our site, you agree to be bound by these terms.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Use of Our Services</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>You must be at least 18 years old or have parental consent to use our services.</li>
          <li>You agree to provide accurate and complete information when placing orders.</li>
          <li>You are responsible for maintaining the confidentiality of your account information.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Orders and Payments</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>All orders are subject to acceptance and availability.</li>
          <li>Prices and availability are subject to change without notice.</li>
          <li>We reserve the right to refuse or cancel any order at our discretion.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8 mb-2">Intellectual Property</h2>
        <p className="mb-4">All content on this site, including text, images, logos, and designs, is the property of the company or its licensors and is protected by copyright laws.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Limitation of Liability</h2>
        <p className="mb-4">We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Changes to These Terms</h2>
        <p className="mb-4">We may update these Terms of Service from time to time. Continued use of our services constitutes acceptance of the revised terms.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
        <p>If you have any questions about these Terms of Service, please contact us at <a href="/contact" className="text-primary underline">our contact page</a>.</p>
      </main>
    </>
  )
} 