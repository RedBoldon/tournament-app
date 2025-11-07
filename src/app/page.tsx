import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Swiss Tournament App</h1>
        <Link href="/login" className="inline-block mb-8 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Log In / Sign Up
        </Link>
      </div>
    </main>
  );
}