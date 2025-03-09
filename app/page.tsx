export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main className="flex-grow">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-light text-[#40C4FF] mb-8">Product Code Generator</h1>
        <p className="text-white mb-4">
          Welcome to the Neo Wave Product Generator. Please use the interface to generate product codes.
        </p>
        <div className="bg-[#2a3744] p-6 rounded-lg">
          <h2 className="text-xl text-[#40C4FF] mb-4">Getting Started</h2>
          <p className="text-white">
            Select products from the menu and customize specifications to generate your product codes.
          </p>
        </div>
      </div>
    </main>
  )
}

