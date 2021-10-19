import Head from 'next/head'

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-t from-gray-800 to-indigo-900 min-h-screen antialiased">
      <Head>
        <title>Epic Mints</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Press+Start+2P&display=swap" rel="stylesheet" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-screen-xl mx-auto text-white flex flex-col justify-center py-24 px-6 font-body relative">
        <header className="text-center mb-20">
          <h1 className="text-4xl font-display mb-6">Epic Mints</h1>
          <p className="text-xl tracking-wide">Get ready!</p>
        </header>
      </main>
    </div>
  )
}
